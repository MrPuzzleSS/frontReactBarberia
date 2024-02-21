import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import ProveedoresService from 'src/views/services/ProveedoresService';
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
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell
} from '@coreui/react';
import { cilPlaylistAdd, cilChildFriendly } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import Toast from 'src/components/toast';
import CompraDataService from 'src/views/services/compraService';
import detalleCompraDataService from 'src/views/services/detalleCompraService';

const CrearCompra = () => {
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      descripcion: '',
      productoSeleccionado: null,
      cantidad: '',
      precioUnitario: '',
      precioVenta: '',
      tipoCompra: '',
      total: '',
    },
  });

  const [submitted, setSubmitted] = useState(false);
  const [visibleLg, setVisibleLg] = useState(false);
  const [productos, setProductos] = useState([]);
  const [tempProductos, setTempProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null); // Estado para almacenar el ID del producto seleccionado

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await CompraDataService.getAllProductos();
        const productos = response.data.productos;

        if (Array.isArray(productos)) {
          setProductos(productos);
        } else {
          console.error('Error: La respuesta no contiene un array de productos', response.data);
        }
      } catch (error) {
        console.error('Error al obtener la lista de productos', error);
      }
    };

    fetchProductos();
  }, []);


  const onAgregarProducto = () => {
    const productoSeleccionadoId = productoSeleccionado?.id_producto;
    const cantidad = watch('cantidad');
    const precioUnitario = watch('precioUnitario');
    const precioVenta = watch('precioVenta');
    const tipoCompra = watch('tipoCompra');

    if (!productoSeleccionadoId || !cantidad || !precioUnitario || !precioVenta || !tipoCompra) {
      console.error('Error: Datos de producto incompletos');
      console.log(productoSeleccionadoId, cantidad, precioUnitario, precioVenta, tipoCompra);
      return;
    }

    // Obtener el producto seleccionado utilizando su ID
    const producto = productos.find(producto => producto.id_producto === productoSeleccionadoId);

    const productoAgregado = {
      producto: producto, // Guardar el objeto completo del producto
      cantidad,
      precioUnitario,
      precioVenta,
      tipoCompra,
      total: cantidad * precioUnitario,
    };

    setTempProductos([...tempProductos, productoAgregado]);

    setValue('productoSeleccionado', null);
    setValue('cantidad', '');
    setValue('precioUnitario', '');
    setValue('precioVenta', '');
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
        estado: 'Pendiente', // Puedes ajustar el estado según tus necesidades
        descripcion: data.descripcion
      };

      const nuevaCompraResponse = await CompraDataService.create(nuevaCompraData);

      if (!nuevaCompraResponse || !nuevaCompraResponse.data || !nuevaCompraResponse.data.id_compra) {
        console.error('Error: La respuesta de CompraDataService.create es incorrecta', nuevaCompraResponse);
        return;
      }

      const idCompra = nuevaCompraResponse.data.id_compra;

      // Paso 2: Crear detalles de la compra
      const detallesCompraPromises = tempProductos.map(async (productoAgregado) => {
        const { producto, cantidad, precioUnitario, precioVenta, tipoCompra, total } = productoAgregado;

        // Verificar que los datos de detalle de compra estén completos
        if (!producto || !cantidad || !precioUnitario || !precioVenta || !tipoCompra || !total) {
          console.error('Error: Datos de detalle de compra incompletos');
          return;
        }

        // Crear el detalle de la compra
        await detalleCompraDataService.create({
          id_compra: idCompra,
          id_producto: producto.id_producto,
          cantidad,
          precioUnitario,
          precioVenta,
          tipoCompra,
          total,
        });
      });

      // Esperar a que todas las promesas de detalles de compra se resuelvan
      await Promise.all(detallesCompraPromises);

      console.log(detallesCompraPromises);

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

  return (
    <CContainer className="px-4">
      <CRow xs={{ gutterX: 5 }}>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Nueva Compra</strong>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <CCol xs={12} md={6}>
                  <CCard>
                    <CCardHeader>
                      <strong>Productos</strong>
                    </CCardHeader>
                    <CCardBody className='mt-2'>
                      <CButton onClick={() => setVisibleLg(!visibleLg)}>
                        <CIcon icon={cilPlaylistAdd} /> Agregar Producto
                      </CButton>
                      <CRow className="justify-content-between align-items-center">
                        <CCol sm="3" className='mt-2'>
                          <CFormLabel>Cantidad</CFormLabel>
                          <Controller
                            name="cantidad"
                            control={control}
                            rules={{ required: false }}
                            render={({ field }) => <CFormInput {...field} />}
                          />
                        </CCol>
                        <CCol sm="4" className='mt-2'>
                          <CFormLabel>Precio Unitario</CFormLabel>
                          <Controller
                            name="precioUnitario"
                            control={control}
                            rules={{ required: false }}
                            render={({ field }) => <CFormInput {...field} />}
                          />
                          {errors.precioUnitario?.type === 'required' && <h4 style={{ color: 'red' }}>*</h4>}
                        </CCol>
                        <CCol sm="5" className='mt-2'>
                          <CFormLabel>Precio Venta</CFormLabel>
                          <Controller
                            name="precioVenta"
                            control={control}
                            rules={{ required: false }}
                            render={({ field }) => <CFormInput {...field} />}
                          />
                          {errors.precioVenta?.type === 'required' && <h4 style={{ color: 'red' }}>*</h4>}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol sm="5" className='mt-2'>
                          <CFormLabel>Tipo</CFormLabel>
                          <Controller
                            name="tipoCompra"
                            control={control}
                            rules={{ required: false }}
                            render={({ field }) => (
                              <CFormSelect {...field}>
                                <option value="">Seleccione</option>
                                <option value="Insumo">Insumo</option>
                                <option value="Producto">Producto</option>
                              </CFormSelect>
                            )}
                          />
                          {errors.tipoCompra?.type === 'required' && <h4 style={{ color: 'red' }}>*</h4>}
                        </CCol>
                        <CCol sm="6" className='mt-2'>
                          <CFormLabel>Total Producto</CFormLabel>
                          <Controller
                            name="total"
                            control={control}
                            rules={{ required: false }}
                            render={({ field }) => <CFormInput {...field} />}
                            disabled
                          />
                          {errors.total?.type === 'required' && <h4 style={{ color: 'red' }}>*</h4>}
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
                      <CFormLabel>Total</CFormLabel>
                      <CFormInput type="text" value={tempProductos.reduce((acc, producto) => acc + producto.total, 0)} disabled />
                      <CCol sm="6" className='mt-2'>
                        <CFormLabel>Descripción de la compra</CFormLabel>
                        <Controller
                          name="descripcionCompra"
                          control={control}
                          rules={{ required: false }}
                          render={({ field }) => <CFormInput {...field} />}
                        />
                        {errors.descripcionCompra?.type === 'required' && <h4 style={{ color: 'red' }}>*</h4>}
                      </CCol>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCard>
                  <CTable hover>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Cantidad</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Precio Unitario</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Precio Venta</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Tipo</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {tempProductos.map((producto, index) => (
                        <CTableRow key={index}>
                          <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                          <CTableDataCell>{producto.producto.nombre}</CTableDataCell>
                          <CTableDataCell>{producto.cantidad}</CTableDataCell>
                          <CTableDataCell>{producto.precioUnitario}</CTableDataCell>
                          <CTableDataCell>{producto.precioVenta}</CTableDataCell>
                          <CTableDataCell>{producto.tipoCompra}</CTableDataCell>
                          <CTableDataCell>{producto.total}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCard>
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
                <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                <CTableHeaderCell scope="col">Stock Actual</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {productos.map((producto, index) => (
                <CTableRow key={producto.id_producto} onClick={() => setProductoSeleccionado(producto)}>
                  <CTableHeaderCell scope="row">{producto.id_producto}</CTableHeaderCell>
                  <CTableDataCell>{producto.nombre}</CTableDataCell>
                  <CTableDataCell>{producto.stock}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleLg(false)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default CrearCompra;
