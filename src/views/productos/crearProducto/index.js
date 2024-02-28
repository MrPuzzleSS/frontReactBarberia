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
  const [nombreValido, setNombreValido] = useState(true);
  const [descripcionValida, setDescripcionValida] = useState(true);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const data = await ProductoService.getAllProductos();
      setProductos(data.productos);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const handleSeleccionarProductoExistente = (productoSeleccionado) => {
    setSelectedProducto(productoSeleccionado);
    if (productoSeleccionado) {
      setNombre(productoSeleccionado.nombre || '');
      setDescripcion(productoSeleccionado.descripcion || '');
      setStock(productoSeleccionado.stock || '');
      setPrecioCosto(productoSeleccionado.precioCosto || '');
      setPrecioVenta(productoSeleccionado.precioVenta || '');
      setEnableGuardar(false);
    }
  };

  const handleIngresoManual = (campo, valor) => {
    switch (campo) {
      case 'nombre':
        setNombre(valor);
        validarNombre(valor);
        break;
      case 'descripcion':
        setDescripcion(valor);
        validarDescripcion(valor);
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

  const validarNombre = (valor) => {
    const nombreRegex = /^[a-zA-Z\sñáéíóúÁÉÍÓÚüÜ]+$/;
    setNombreValido(nombreRegex.test(valor));
  };

  const validarDescripcion = (valor) => {
    const descripcionRegex = /^[a-zA-Z\sñáéíóúÁÉÍÓÚüÜ\d.,;:¡!¿?()\[\]{}'"\-_&%$#@|]+$/;
    setDescripcionValida(descripcionRegex.test(valor));
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleGuardarProducto = async (e,) => {
    e.preventDefault();

    // Validación de campos requeridos
    if (!nombre || !descripcion) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Producto existente. No puedes agregar este producto nuevamente.',
      });
      return;
    }

    const nuevoProducto = {
      nombre: nombre,
      descripcion: descripcion,
      precioCosto: precioCosto,
      precioVenta: precioVenta,
      stock: stock,

    };

    try {
      const response = await fetch('http://localhost:8095/api/producto', {
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
            }, 1000);
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
      }
    } catch (error) {
      console.error('Error al enviar los datos del producto al servidor:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al enviar los datos del producto al servidor.',
      });
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
            {esNuevoProducto && (
              <div>
                <CCol xs={5}></CCol>
                <CCol xs={5}>
                  <div className="mb-3">
                    <CFormLabel style={{ fontWeight: 'bold' }}>
                      Nombre<span style={{ color: 'red' }}>*</span>
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      value={nombre}
                      onChange={(e) => handleIngresoManual('nombre', e.target.value)}
                      required
                    />
                    {!nombreValido && <span className="text-danger">El campo Nombre solo puede contener letras y espacios.</span>}
                  </div>
                  <div className="mb-3">
                    <CFormLabel style={{ fontWeight: 'bold' }}>
                      Descripción<span style={{ color: 'red' }}>*</span>
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      value={descripcion}
                      onChange={(e) => handleIngresoManual('descripcion', e.target.value)}
                      required
                    />
                    {!descripcionValida && <span className="text-danger">El campo Descripción solo puede contener letras, números y algunos caracteres especiales.</span>}
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

            {!esNuevoProducto && (
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
                        disabled={esNuevoProducto}
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
                        disabled={esNuevoProducto}
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
                    disabled={!enableGuardar}
                  >
                    Guardar Cambios
                  </CButton>
                  <CButton
                    type="button"
                    color="secondary"
                    onClick={() => {
                      setEnableGuardar(true);
                      setSelectedProducto(null);
                    }}
                  >
                    Cancelar
                  </CButton>
                </CCol>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}
export default CrearProducto;
