import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormLabel,
  CFormInput,
  CRow,
} from '@coreui/react';
import ProductoService from 'src/views/services/productoService';

function CrearProducto() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');
  const [precioCosto, setPrecioCosto] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [esNuevoProducto, setEsNuevoProducto] = useState(false);
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [enableGuardar, setEnableGuardar] = useState(true); // Estado para habilitar/deshabilitar el botón


  const fetchProductos = async () => {
    try {
      const data = await ProductoService.getAllProductos();
      setProductos(data.productos);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  useEffect(() => {

    fetchProductos();
  }, []);

  // Función para capturar los datos de un producto existente
  const handleSeleccionarProductoExistente = (productoSeleccionado) => {
    setSelectedProducto(productoSeleccionado);
    if (productoSeleccionado) {
      setNombre(productoSeleccionado.nombre || '');
      setDescripcion(productoSeleccionado.descripcion || '');
      setStock(productoSeleccionado.stock || '');
      setPrecioCosto(productoSeleccionado.precioCosto || '');
      setPrecioVenta(productoSeleccionado.precioVenta || '');
      setEnableGuardar(false); // Deshabilita el botón "Guardar Cambios" al seleccionar un producto
    }
  };



  // Función para capturar los datos ingresados manualmente
  const handleIngresoManual = (campo, valor) => {
    switch (campo) {
      case 'nombre':
        setNombre(valor);
        break;
      case 'descripcion':
        setDescripcion(valor);
        break;
      case 'stock':
        setStock(valor);
        break;
      case 'precioCosto':
        setPrecioCosto(valor);
        break;
      case 'precioVenta':
        setPrecioVenta(valor);
        break;
      default:
        break;
    }
  };

 
  

  const handleGuardarProducto = async (e,) => {
    e.preventDefault();

    // Validación de campos requeridos
    if (!nombre || !descripcion) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos obligatorios.',
      });
      return; // Detener la ejecución si hay campos vacíos
    }

    const nuevoProducto = {
      nombre: nombre,
      descripcion: descripcion,
      precioCosto: precioCosto,
      precioVenta: precioVenta,
      stock: stock,

    };

    try {
      const response = await fetch('https://restapibarberia.onrender.com/api/producto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProducto),
      });

      const responseData = await response.json(); // Convertir la respuesta a JSON

      if (response.ok) {
        console.log('Producto guardado:', responseData.producto);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Producto guardado exitosamente.',
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            setTimeout(() => {
              window.location.href = '/Productos/lista-Productos';
            }, 1500); // Redirigir después de 1.5 segundos (ajusta este tiempo según tu preferencia)
          }
        });

        // Resto de tu lógica de éxito
      } else {
        console.error('Error al guardar el producto:', responseData.error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al guardar el producto.',
        });
        // Resto de tu lógica de manejo de errores
      }
    } catch (error) {
      console.error('Error al enviar los datos del producto al servidor:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al enviar los datos del producto al servidor.',
      });
      // Resto de tu lógica de manejo de errores
    }
  };


  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Crear Producto</strong>
          </CCardHeader>

          <div className="mb-1">
            <CFormLabel>
              <input
                type="checkbox"
                checked={esNuevoProducto}
                onChange={() => setEsNuevoProducto(!esNuevoProducto)}
              />
              {esNuevoProducto ? 'Producto Nuevo' : 'Producto Existente'}
            </CFormLabel>
          </div>
          <CCardBody>
            {
              esNuevoProducto && (
                <div>
                  <CCol xs={5}>
                  </CCol>
                  <CCol xs={5}>
                    <div className="mb-3">
                      <CFormLabel>Nombre</CFormLabel>
                      <CFormInput
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <CFormLabel>Descripción</CFormLabel>
                      <CFormInput
                        type="text"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                      />
                    </div>
                  </CCol>
                  <CCol xs={4}>
                    <CButton type="button" color="primary" onClick={handleGuardarProducto}>
                      Guardar Cambios
                    </CButton>
                    <Link to="/Productos/lista-Productos">
                      <CButton type="button" color="secondary">
                        Cancelar
                      </CButton>
                    </Link>
                  </CCol>
                </div>
              )}

            {
              !esNuevoProducto && (
                <div>
                  <CRow>
                    <CCol xs={4}>
                      <CFormLabel>
                        <strong>Buscar producto</strong>
                      </CFormLabel>
                      <select
                        value={selectedProducto ? selectedProducto.id_producto : ''}
                        onChange={(e) => {
                          const selectedId = parseInt(e.target.value);
                          const productoSeleccionado = productos.find((producto) => producto.id_producto === selectedId);
                          handleSeleccionarProductoExistente(productoSeleccionado);
                        }}
                        className="form-select"
                      >
                        <option value="">Seleccionar producto</option>
                        {productos.map((producto) => (
                          <option key={producto.id_producto} value={producto.id_producto}>
                            {producto.nombre}
                          </option>
                        ))}
                      </select>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs={4}>
                      <div className="mb-3">
                        <CFormLabel>Nombre</CFormLabel>
                        <CFormInput
                          type="text"
                          value={nombre}
                          onChange={(e) => handleIngresoManual('nombre', e.target.value)}
                          required
                          disabled={esNuevoProducto} // Deshabilita el campo si es un producto nuevo
                        />
                      </div>
                    </CCol>
                    <CCol xs={4}>
                      <div className="mb-3">
                        <CFormLabel>Descripción</CFormLabel>
                        <CFormInput
                          type="text"
                          value={descripcion}
                          onChange={(e) => handleIngresoManual('descripcion', e.target.value)}
                          required
                          disabled={esNuevoProducto} // Deshabilita el campo si es un producto nuevo
                        />
                      </div>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs={4}>
                      <div className="mb-3">
                        <CFormLabel>Precio Costo</CFormLabel>
                        <CFormInput
                          type="number"
                          value={precioCosto}
                          onChange={(e) => handleIngresoManual('precioCosto', e.target.value)}
                          required
                        />
                      </div>
                    </CCol>
                    <CCol xs={4}>
                      <div className="mb-3">
                        <CFormLabel>Precio Venta</CFormLabel>
                        <CFormInput
                          type="number"
                          value={precioVenta}
                          onChange={(e) => handleIngresoManual('precioVenta', e.target.value)}
                          required
                        />
                      </div>
                    </CCol>
                    <CCol xs={4}>
                      <div className="mb-3">
                        <CFormLabel>Stock</CFormLabel>
                        <CFormInput
                          type="number"
                          value={stock}
                          onChange={(e) => handleIngresoManual('stock', e.target.value)}
                          required
                        />
                      </div>
                    </CCol>
                  </CRow>
                  <CCol xs={4}>
                    <CButton
                      type="button"
                      color="primary"
                      onClick={handleGuardarProducto}
                      disabled={!enableGuardar} // Deshabilita el botón si no está habilitado
                    >
                      Guardar Cambios
                    </CButton>
                    <CButton
                      type="button"
                      color="secondary"
                      onClick={() => {
                        setEnableGuardar(true); // Habilita el botón "Guardar Cambios"
                        setSelectedProducto(null); // Borra la selección de producto al cancelar
                      }}
                    >
                      Cancelar
                    </CButton>
                  </CCol>
                </div>
              )
            }
          </CCardBody >
        </CCard >
      </CCol>
    </CRow>
  );
}
export default CrearProducto;

