import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useForm, Controller } from 'react-hook-form';
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect
} from '@coreui/react';
import { cilPlaylistAdd, cilChildFriendly } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import Toast from 'src/components/toast';
import CompraDataService from 'src/views/services/compraService';
import detalleCompraDataService from 'src/views/services/detalleCompraInsuService';
import ProveedoresService from 'src/views/services/ProveedoresService';

const CrearCompraInsu = () => {
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      noFactura: '',
      proveedor: '',
      productoSeleccionado: null,
      cantidad: '',
      precioUnitario: '',
      total: '',
    },
  });

  const [submitted, setSubmitted] = useState(false);
  const [visibleLg, setVisibleLg] = useState(false);
  const [productos, setProductos] = useState([]);
  const [tempProductos, setTempProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null); // Estado para almacenar el ID del producto seleccionado
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await ProveedoresService.getAll();
        setProveedores(response.data.listProveedores);
      } catch (error) {
        console.error('Error al obtener la lista de proveedores:', error);
      }
    };

    const fetchInsumo = async () => {
      try {
        const response = await CompraDataService.getAllProductosInsu();
        console.log(response)
        const productos = response.data.listInsumos;

        if (Array.isArray(productos)) {
          setProductos(productos);
        } else {
          console.error('Error: La respuesta no contiene un array de productos', response.data);
        }
      } catch (error) {
        console.error('Error al obtener la lista de productos', error);
      }
    };

    fetchProveedores();
    fetchInsumo();
  }, []);


  const onAgregarProducto = () => {
    const productoSeleccionadoId = productoSeleccionado?.id_insumo;
    const cantidad = parseInt(watch('cantidad')); // Convertir a número entero
    const precioUnitario = parseFloat(watch('precioUnitario')); // Convertir a número decimal

    if (!productoSeleccionadoId || !cantidad || !precioUnitario) {
      console.error('Error: Datos de producto incompletos');
      console.log(productoSeleccionadoId, cantidad, precioUnitario);
      return;
    }

    // Verificar si el producto ya existe en la lista
    const index = tempProductos.findIndex(producto => producto.producto.id_insumo === productoSeleccionadoId);

    if (index !== -1) {
      // Si el producto existe, sumar la cantidad y actualizar precios
      const productoExistente = tempProductos[index];
      productoExistente.cantidad += cantidad; // Sumar la cantidad existente con la nueva cantidad
      productoExistente.precioUnitario = precioUnitario;
      productoExistente.total = productoExistente.cantidad * precioUnitario;

      const updatedTempProductos = [...tempProductos];
      updatedTempProductos[index] = productoExistente;
      setTempProductos(updatedTempProductos);
    } else {
      // Si el producto no existe, agregarlo a la lista
      const producto = productos.find(producto => producto.id_insumo === productoSeleccionadoId);

      const productoAgregado = {
        producto: producto, // Guardar el objeto completo del producto
        cantidad,
        precioUnitario,
        total: cantidad * precioUnitario,
      };

      setTempProductos([...tempProductos, productoAgregado]);
    }

    // Limpiar los campos y mostrar mensaje de éxito
    setValue('productoSeleccionado', null);
    setValue('cantidad', '');
    setValue('precioUnitario', '');
    setValue('tipoCompra', '');

    Toast.fire({
      icon: "success",
      title: "El producto se agregó correctamente"
    });
  };

  const onSubmit = async (data) => {
    try {
      // Paso 0: Verificar que haya al menos un producto agregado
      if (tempProductos.length === 0) {
        console.error('Error: No hay productos agregados a la compra');
        return;
      }

      // Paso 1: Crear la compra
      const nuevaCompraData = {
        id_proveedor: data.proveedor,
        no_factura: data.noFactura,
        tipoCompra: 'Insumo',
        estado: 'Pendiente',
      };

      console.log(nuevaCompraData);

      const nuevaCompraResponse = await CompraDataService.create(nuevaCompraData);

      if (!nuevaCompraResponse || !nuevaCompraResponse.data || !nuevaCompraResponse.data.id_compra) {
        console.error('Error: La respuesta de CompraDataService.create es incorrecta', nuevaCompraResponse);
        return;
      }

      const idCompra = nuevaCompraResponse.data.id_compra;

      // Paso 2: Crear detalles de la compra
      const detallesCompraPromises = tempProductos.map(async (productoAgregado) => {
        const { producto, cantidad, precioUnitario, total } = productoAgregado;

        // Verificar que los datos de detalle de compra estén completos
        if (!producto || !cantidad || !precioUnitario || !total) {
          console.error('Error: Datos de detalle de compra incompletos');
          return;
        }

        // Crear el detalle de la compra
        await detalleCompraDataService.create({
          id_compra: idCompra,
          id_insumo: producto.id_insumo,
          cantidad,
          precioUnitario,
          total,
        });
      });

      // Esperar a que todas las promesas de detalles de compra se resuelvan
      await Promise.all(detallesCompraPromises);

      // Mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'La compra se ha creado con éxito',
        showConfirmButton: false,
        timer: 1500,
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error al crear la compra', error);
    }
  };

  const handleProductoSeleccionado = (producto) => {
    setProductoSeleccionado(producto);
    setVisibleLg(false); // Cerrar el modal al seleccionar un producto
  };

  return (
    <CContainer className="px-4">
      <CRow xs={{ gutterX: 5 }}>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Nueva Compra Insumo</strong>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <CCol xs={12} md={6}>
                  <CCard>
                    <CCardHeader>
                      <strong >Productos</strong>
                    </CCardHeader>
                    <CCardBody className='mt-4'>
                      <CButton onClick={() => setVisibleLg(!visibleLg)}>
                        <CIcon icon={cilPlaylistAdd} /> Agregar Insumo
                      </CButton>
                      <CRow className="justify-content-between align">
                        <CCol sm="4" className='mt-5'>
                          <CFormLabel style={{ fontWeight: 'bold' }}>Cantidad</CFormLabel>
                          <Controller
                            name="cantidad"
                            control={control}
                            rules={{ required: false, min: 1 }}
                            render={({ field }) => <CFormInput type='number' placeholder='1' {...field} />}
                          />
                        </CCol>
                        <CCol sm="6" className='mt-5'>
                          <CFormLabel style={{ fontWeight: 'bold' }}>Precio Unitario</CFormLabel>
                          <Controller
                            name="precioUnitario"
                            control={control}
                            rules={{ required: false }}
                            render={({ field }) => <CFormInput type='number' placeholder='$ 5.000' {...field} />}
                          />
                          {errors.precioUnitario?.type === 'required' && <h4 style={{ color: 'red' }}>*</h4>}
                        </CCol>
                      </CRow>
                    </CCardBody>
                    <CCardFooter className="d-flex justify-content-end">
                      <CButton type="button" color="primary" onClick={onAgregarProducto}>
                        <CIcon icon={cilChildFriendly} /> Agregar al Carrito
                      </CButton>
                    </CCardFooter>
                  </CCard>
                </CCol>
                <CCol xs={12} md={6}>
                  <CCard>
                    <CCardHeader>
                      <strong>Total de la Compra</strong>
                    </CCardHeader>
                    <CCardBody>
                      <CRow className="justify-content-between align-items-center">
                        <CCol className='mt-3' sm="5">
                          <CFormLabel style={{ fontWeight: 'bold' }}>No. Factura</CFormLabel>
                          <Controller
                            name="noFactura"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <CFormInput {...field} />}
                          />
                          {errors.descripcion?.type === 'required' && <h4 style={{ color: 'red' }}>*</h4>}
                        </CCol>
                        <CCol className='mt-4' sm="7">
                          <CFormLabel style={{ fontWeight: 'bold' }}>Proveedor</CFormLabel>
                          <Controller
                            name="proveedor"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <CFormSelect {...field}>
                                <option>Seleccionar Proveedor</option>
                                {proveedores.map(proveedor => (
                                  <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                                    {proveedor.nombre}
                                  </option>
                                ))}
                              </CFormSelect>
                            )}
                          />
                          {errors.proveedor?.type === 'required' && <h4 style={{ color: 'red' }}>*</h4>}
                        </CCol>
                      </CRow>
                      <CCol className='mt-3' sm="5">
                        <CFormLabel style={{ fontWeight: 'bold' }}>Total</CFormLabel>
                        <CFormInput type="text" value={tempProductos.reduce((acc, producto) => acc + producto.total, 0)} disabled />
                      </CCol>
                    </CCardBody>
                    <CCardFooter>
                      <CCol xs={12}>
                        <CButton type="submit" color="primary" className="me-md-2">
                          Crear Compra
                        </CButton>
                        <Link to="/compras/lista-compras">
                          <CButton type="button" color="secondary">
                            Cancelar
                          </CButton>
                        </Link>
                      </CCol>
                    </CCardFooter>
                  </CCard>
                </CCol>
                <CCard>
                  <CTable hover>
                    <CTableHead>
                      <CTableRow>
                        {/* <CTableHeaderCell scope="col">#</CTableHeaderCell> */}
                        <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Cantidad</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Precio Unitario</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {tempProductos.map((producto, index) => (
                        <CTableRow key={index}>
                          {/* <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell> */}
                          <CTableDataCell>{producto.producto.nombre}</CTableDataCell>
                          <CTableDataCell>{producto.cantidad}</CTableDataCell>
                          <CTableDataCell>{producto.precioUnitario}</CTableDataCell>
                          <CTableDataCell>{producto.total}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCard>
              </CForm>
              {submitted && <Navigate to="/compras/lista-compras" />}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal
        size="lg"
        scrollable
        visible={visibleLg}
        onClose={() => setVisibleLg(false)}
        aria-labelledby="ScrollingLongContentExampleLabel2"
      >
        <CModalHeader>
          <CModalTitle id="ScrollingLongContentExampleLabel2">Lista de Productos</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CTable hover>
            <CTableHead>
              <CTableRow>
                {/* <CTableHeaderCell scope="col">ID</CTableHeaderCell> */}
                <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                <CTableHeaderCell scope="col">Stock Actual</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {productos.map((producto, index) => (
                <CTableRow
                  key={index}
                  onClick={() => handleProductoSeleccionado(producto)}
                  active={productoSeleccionado === producto}
                >
                  {/* <CTableHeaderCell scope="row">{producto.id_insumo}</CTableHeaderCell> */}
                  <CTableDataCell>{producto.nombre}</CTableDataCell>
                  <CTableDataCell>{producto.stock}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CModalBody>
      </CModal>
    </CContainer>
  );
};

export default CrearCompraInsu;
