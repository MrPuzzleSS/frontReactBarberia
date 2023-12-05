import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import ProveedoresService from 'src/views/services/ProveedoresService';
import Swal from 'sweetalert2';
import { useForm, Controller } from 'react-hook-form';
import {
  CButton,
  CCard,
  CCardBody,
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
import { cilPlaylistAdd } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import Toast from 'src/components/toast';
import CompraDataService from 'src/views/services/compraService';
import detalleCompraDataService from 'src/views/services/detalleCompraService';

const CrearCompra = () => {
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      proveedor: '',
      productoSeleccionado: null,
      cantidad: '',
      precioUnitario: '',
      total: '',
    },
  });

  const [submitted, setSubmitted] = useState(false);
  const [visibleLg, setVisibleLg] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProveedor, setSelectedProveedor] = useState({
    id: '',
    nombre: '',
    productos: [],
  });
  const [tempProductos, setTempProductos] = useState([]);
  
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await ProveedoresService.getAll();
        const nestedArray = response.data && response.data.listProveedores;

        if (Array.isArray(nestedArray)) {
          setProveedores(nestedArray);
        } else {
          console.error('Error: La respuesta no contiene un array de proveedores', response.data);
        }
      } catch (error) {
        console.error('Error al obtener la lista de proveedores', error);
      }
    };

    fetchProveedores();
  }, []);

  const onSelectProveedor = async (idProveedor) => {
    try {
      const response = await ProveedoresService.getProveedoresProductos(idProveedor);
      const { proveedor, productos } = response.data;

      if (!proveedor || !productos) {
        console.error('Respuesta de la API incompleta');
        return;
      }

      setSelectedProveedor({
        id: proveedor.id_proveedor, // Asegúrate de usar el campo correcto del modelo
        nombre: proveedor.nombre,
        productos: productos,
      });

      setProductos(productos);
    } catch (error) {
      console.error('Error al obtener la lista de productos del proveedor', error);
    }
  };

  const onSelectProduct = (producto) => {
    setSelectedProduct(producto);
    setValue('productoSeleccionado', producto);
    setValue('precioUnitario', producto.precio);
  };

  const onAgregarProducto = () => {
    const productoSeleccionado = watch('productoSeleccionado');
    const cantidad = watch('cantidad');
    const precioUnitario = watch('precioUnitario');
  
    if (!productoSeleccionado || !cantidad || !precioUnitario) {
      return;
    }
  
    const productoAgregado = {
      producto: productoSeleccionado,
      cantidad,
      precioUnitario,
      total: cantidad * precioUnitario,
    };
  
    setTempProductos([...tempProductos, productoAgregado]);
  
    setValue('productoSeleccionado', null);
    setValue('cantidad', '');
    setValue('precioUnitario', '');

    Toast.fire({
      icon: "success",
      title: "El producto se agrego correctamente"
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
        const { producto, cantidad, precioUnitario, total } = productoAgregado;
  
        // Verificar que los datos de detalle de compra estén completos
        if (!producto || !cantidad || !precioUnitario || !total) {
          console.error('Error: Datos de detalle de compra incompletos');
          return;
        }
  
        // Crear el detalle de la compra
        await detalleCompraDataService.create({
          id_compra: idCompra,
          id_producto: producto.id_producto,
          cantidad,
          precioUnitario,
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
                <CCol sm={4}>
                  <Controller
                    name="proveedor"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CFormSelect
                        {...field}
                        onChange={(e) => {
                          setValue('proveedor', e.target.value);
                          onSelectProveedor(e.target.value);
                        }}
                      >
                        <option value=''>Selecciona un Proveedor</option>
                        {proveedores.map((proveedor) => (
                          <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                            {proveedor.nombre}
                          </option>
                        ))}
                      </CFormSelect>
                    )}
                  />
                </CCol>
                <CCol sm={4} className="d-flex align-items-center">
                <Controller
                  name="descripcion"
                  control={control}
                  rules={{required: true}}
                  render={({ field }) => <CFormInput {...field} placeholder='Descripción de la compra'/>}
                />
                {errors.descripcion?.type === 'required' && <h4 style={{color: 'red'}}>*</h4>}
              </CCol>
                <CCol sm={4} className="d-flex align-items-end">
                  <CButton onClick={() => setVisibleLg(!visibleLg)}>
                    <CIcon icon={cilPlaylistAdd} /> Agregar Producto
                  </CButton>
                  <CModal
                    alignment="center"
                    scrollable
                    size='lg'
                    visible={visibleLg}
                    onClose={() => setVisibleLg(false)}
                    aria-labelledby="VerticallyCenteredScrollableExample"
                  >
                    <CModalHeader>
                      <CModalTitle id="VerticallyCenteredScrollableExample">
                        Lista de Productos
                      </CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                    <CCard>
                    <CTable hover>
                    <CTableHead>
                        <CTableRow>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Descripcion</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Precio</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Stock</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                      {selectedProveedor.productos.map((producto, index) => (
                          <CTableRow key={index} onClick={() => onSelectProduct(producto)}>
                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                            <CTableDataCell>{producto.nombre}</CTableDataCell>
                            <CTableDataCell>{producto.descripcion}</CTableDataCell>
                            <CTableDataCell>{producto.precio}</CTableDataCell>
                            <CTableDataCell>{producto.stock}</CTableDataCell>
                            <CTableDataCell>{producto.estado}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                </CTable>
                </CCard>
                <CRow>
                    <CCol sm={4}>
                  <CFormLabel>Cantidad</CFormLabel>
                  <Controller
                    name="cantidad"
                    control={control}
                    rules={{required: true}}
                    render={({ field }) => <CFormInput {...field} />}
                  />
                  {errors.cantidad?.type === 'required' && <h4 style={{color: 'red'}}>*</h4>}
                </CCol>
                <CCol sm={4}>
                  <CFormLabel>Precio Unitario</CFormLabel>
                  <Controller
                    name="precioUnitario"
                    control={control}
                    rules={{required: true}}
                    render={({ field }) => <CFormInput {...field} />}
                  />
                </CCol>
                </CRow>
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        color="secondary"
                        onClick={() => setVisibleLg(false)}
                      >
                        Cerrar
                      </CButton>
                      <CButton color="primary" onClick={onAgregarProducto}>
                        Agregar Producto
                      </CButton>
                    </CModalFooter>
                  </CModal>
                </CCol>
                <CCard>
                <CTable hover>
                <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Cantidad</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Precio Unitario</CTableHeaderCell>
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
                  <Link to="/proveedores/lista-proveedores">
                    <CButton type="button" color="secondary">
                      Cancelar
                    </CButton>
                  </Link>
                </CCol>
              </CForm>
              {submitted && <Navigate to="/proveedores/lista-compras" />}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default CrearCompra;
