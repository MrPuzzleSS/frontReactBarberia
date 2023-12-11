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
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [precioCosto, setPrecioCosto] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [esNuevoProducto, setEsNuevoProducto] = useState(false);
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);

  const fetchProveedores = async () => {
    try {
      const response = await ProductoService.obtenerProveedores();
      if (Array.isArray(response)) {
        setProveedores(response);
      } else {
        console.error('La respuesta de obtenerProveedores no tiene la estructura esperada:', response);
      }
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      const data = await ProductoService.getAllProductos();
      setProductos(data.productos);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  useEffect(() => {
    fetchProveedores();
    fetchProductos();
  }, []);

  const handleSeleccionarProductoExistente = (productoSeleccionado) => {
    setSelectedProducto(productoSeleccionado);
    if (productoSeleccionado) {
      setNombre(productoSeleccionado.nombre || '');
      setDescripcion(productoSeleccionado.descripcion || '');
      setStock(productoSeleccionado.stock || '');
      setPrecioCosto(productoSeleccionado.precioCosto || '');
      setPrecioVenta(productoSeleccionado.precioVenta || '');
    }
  };




  // ...

  const handleGuardarProducto = async (e) => {
    e.preventDefault();

    // Validación de campos requeridos
    if (!selectedProveedor || !nombre || !descripcion) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos obligatorios.',
      });
      return; // Detener la ejecución si hay campos vacíos
    }

    // Encontrar el ID del proveedor seleccionado a partir del nombre
    const proveedorSeleccionado = proveedores.find((prov) => prov.nombre === selectedProveedor);
    const id_proveedor = proveedorSeleccionado ? proveedorSeleccionado.id_proveedor : '';

    const nuevoProducto = {
      id_proveedor: id_proveedor,
      nombre: nombre,
      descripcion: descripcion,
      // Incluye los demás campos del producto aquí, como precio, stock, precioCosto, precioVenta, etc.
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

          <div className="mb-3">
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
                <CFormLabel>Seleccionar proveedor</CFormLabel>
                <CCol xs={6}>
                  <select
                    value={selectedProveedor}
                    onChange={(e) => {
                      setSelectedProveedor(e.target.value);
                      console.log('Proveedor seleccionado:', e.target.value); // Agregar este console.log
                    }}
                    className="form-select"
                  >
                    <option value="">Seleccionar proveedor</option>
                    {proveedores.map((proveedor) => (
                      <option key={proveedor.id} value={proveedor.id}>
                        {proveedor.nombre}
                      </option>
                    ))}
                  </select>
                </CCol>
                <CCol xs={6}>
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
              </div>
            )}

            {
              !esNuevoProducto && (
                <div>
                  <CRow>
                    <CCol xs={6}>
                      <CFormLabel>Seleccionar proveedor</CFormLabel>
                      <select
                        value={selectedProveedor}
                        onChange={(e) => {
                          setSelectedProveedor(e.target.value);
                          console.log('Proveedor seleccionado:', e.target.value);
                        }}
                        className="form-select"
                      >
                        <option value="">Seleccionar proveedor</option>
                        {proveedores.map((proveedor) => (
                          <option key={proveedor.id} value={proveedor.id}>
                            {proveedor.nombre}
                          </option>
                        ))}
                      </select>
                    </CCol>
                    <CCol xs={6}>
                      <CFormLabel>Seleccionar producto</CFormLabel>
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
                          value={selectedProducto ? selectedProducto.nombre || '' : ''}
                          onChange={(e) => setSelectedProducto({ ...selectedProducto, nombre: e.target.value })}
                        />
                      </div>
                    </CCol>
                    <CCol xs={4}>
                      <div className="mb-3">
                        <CFormLabel>Stock</CFormLabel>
                        <CFormInput
                          type="number"
                          value={selectedProducto ? selectedProducto.stock || '' : ''}
                          onChange={(e) => setSelectedProducto({ ...selectedProducto, stock: e.target.value })}
                        />
                      </div>
                    </CCol>
                    <CCol xs={4}>
                      <div className="mb-3">
                        <CFormLabel>Descripción</CFormLabel>
                        <CFormInput
                          type="text"
                          value={selectedProducto ? selectedProducto.descripcion || '' : ''}
                          onChange={(e) => setSelectedProducto({ ...selectedProducto, descripcion: e.target.value })}
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
                          value={selectedProducto ? selectedProducto.precioCosto || '' : ''}
                          onChange={(e) => setSelectedProducto({ ...selectedProducto, precioCosto: e.target.value })}
                        />
                      </div>
                    </CCol>
                    <CCol xs={4}>
                      <div className="mb-3">
                        <CFormLabel>Precio Venta</CFormLabel>
                        <CFormInput
                          type="number"
                          value={selectedProducto ? selectedProducto.precioVenta || '' : ''}
                          onChange={(e) => setSelectedProducto({ ...selectedProducto, precioVenta: e.target.value })}
                        />
                      </div>
                    </CCol>

                  </CRow>
                </div>
              )
            }

            <CCol xs={4}>
              {/* Botón para guardar los cambios */}
              <CButton type="button" color="primary" onClick={handleGuardarProducto}>
                Guardar Cambios
              </CButton>
              <Link to="/Productos/lista-Productos">
              <CButton type="button" color="secondary">
                Cancelar
              </CButton>
            </Link>


            </CCol>


            {/* Botón para cancelar */}
          
          </CCardBody>



        </CCard>
      </CCol>
    </CRow>
  );
}
export default CrearProducto;

