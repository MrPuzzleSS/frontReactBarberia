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
      descripcion: '',
      productoSeleccionado: null,
      cantidad: '',
      precioUnitario: '',
      precioVenta: '',
      total: '',
    },
  });

  const [submitted, setSubmitted] = useState(false);
  const [visibleLg, setVisibleLg] = useState(false);
  const [productos, setProductos] = useState([]);
  const [tempProductos, setTempProductos] = useState([]);
  
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await CompraDataService.getAllProductos();
        const productos = response.data;

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

  const onSelectProduct = (producto) => {
    setValue('productoSeleccionado', producto);
    setValue('cantidad', producto.stock);
    setValue('precioUnitario', producto.precioCosto);
    setValue('precioVenta', producto.precioVenta);
  };

  const onAgregarProducto = () => {
    const productoSeleccionado = watch('productoSeleccionado');
    const cantidad = watch('cantidad');
    const precioUnitario = watch('precioUnitario');
    const precioVenta = watch('precioVenta');
  
    if (!productoSeleccionado || !cantidad || !precioUnitario) {
      return;
    }
  
    const productoAgregado = {
      producto: productoSeleccionado,
      cantidad,
      precioUnitario,
      precioVenta,
      total: cantidad * precioUnitario,
    };
  
    setTempProductos([...tempProductos, productoAgregado]);
  
    setValue('productoSeleccionado', null);
    setValue('cantidad', '');
    setValue('precioUnitario', '');
    setValue('precioVenta', '');

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
        const { producto, cantidad, precioUnitario, precioVenta, total } = productoAgregado;
  
        // Verificar que los datos de detalle de compra estén completos
        if (!producto || !cantidad || !precioUnitario || !precioVenta || !total) {
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
                  <CFormLabel>Descripción de la compra</CFormLabel>
                  <Controller
                    name="descripcion"
                    control={control}
                    rules={{required: true}}
                    render={({ field }) => <CFormInput {...field} />}
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
                              <CTableHeaderCell scope="col">Descripción</CTableHeaderCell>
                              <CTableHeaderCell scope="col">Precio Unitario</CTableHeaderCell>
                              <CTableHeaderCell scope="col">Precio Venta</CTableHeaderCell>
                              <CTableHeaderCell scope="col">Stock</CTableHeaderCell>
                              <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {productos.map((producto, index) => (
                              <CTableRow key={index} onClick={() => onSelectProduct(producto)}>
                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                <CTableDataCell>{producto.nombre}</CTableDataCell>
                                <CTableDataCell>{producto.descripcion}</CTableDataCell>
                                <CTableDataCell>{producto.precioCosto}</CTableDataCell>
                                <CTableDataCell>{producto.precioVenta}</CTableDataCell>
                                <CTableDataCell>{producto.stock}</CTableDataCell>
                                <CTableDataCell>{producto.estado}</CTableDataCell>
                              </CTableRow>
                            ))}
                          </CTableBody>
                        </CTable>
                      </CCard>
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
                        <CTableHeaderCell scope="col">Precio Venta</CTableHeaderCell>
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
    </CContainer>
  );
};

export default CrearCompra;
