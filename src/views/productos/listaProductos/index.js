import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

import ProductoService from '../../services/productoService';

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CFormLabel,
  CFormInput,
  CFormSwitch,
 

} from '@coreui/react';


function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [visible, setVisible] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [selectedProductoId, setSelectedProductoId] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    precioCosto: "",
    precioVenta: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const respuesta = await ProductoService.getAll(); // Utiliza la función getAll del servicio
        setProductos(respuesta.data.productos);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);



  const handleEditar = (producto) => {
    if (producto.estado === 'Inactivo') {
      Swal.fire({
        icon: 'warning',
        title: 'Producto inactivo',
        text: 'No se puede editar un producto inactivo.',
      });
      return; // Detener la edición del producto inactivo
    }

    setSelectedProductoId(producto);
    setVisible(true);
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   seteditingProducto((prevProducto) => ({
  //     ...prevProducto,
  //     [name]: value,
  //   }));
  // };


  const handleGuardarCambios = async () => {
    try {
      console.log('selectedProductoId:', selectedProductoId);
      console.log('selectedProductoId.id:', selectedProductoId.id_producto);
      if (selectedProductoId && selectedProductoId.id_producto) {
        await ProductoService.updateProducto(selectedProductoId.id_producto, selectedProductoId);
        fetchProductos();
        setVisible(false);
        Swal.fire({
          icon: 'success',
          title: 'Cambios guardados',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.error('Error: ID de producto no definido o válido.');
      }
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    }
  };

  const handleCambiarEstado = async (id_producto, estado) => {
    try {
      await ProductoService.putProducto(id_producto, estado); // Pasar el nuevo estado al servicio
      fetchProductos();
      Swal.fire({
        icon: 'success',
        title: 'Estado cambiado',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error al cambiar el estado del producto:', error);
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
  useEffect(() => {
    fetchProductos();
    fetchProveedores();
  }, []);
  const switchStyle = {
    width: '30px',
     
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Lista de Productos</strong>
              <Link to="/Productos/crear-Producto">
                <CButton color="primary">Agregar Producto</CButton>
              </Link>
            </div>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Nombre</CTableHeaderCell>
                  <CTableHeaderCell>Descripción</CTableHeaderCell>
                  <CTableHeaderCell>Precio costo</CTableHeaderCell>
                  <CTableHeaderCell>Precio venta</CTableHeaderCell>
                  <CTableHeaderCell>Stock</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {productos.map((producto) => (
                  <CTableRow key={producto.id_producto}>
                  
                    <CTableDataCell>{producto.nombre}</CTableDataCell>
                    <CTableDataCell>{producto.descripcion}</CTableDataCell>
                    <CTableDataCell>{producto.precioCosto}</CTableDataCell>
                    <CTableDataCell>{producto.precioVenta}</CTableDataCell>
                    <CTableDataCell>{producto.stock}</CTableDataCell>
                    <CTableDataCell
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <CFormSwitch
                        checked={producto.estado === 'Activo'}
                        onChange={() =>
                          handleCambiarEstado(
                            producto.id_producto,
                            producto.estado === 'Activo' ? 'Inactivo' : 'Activo'
                          )
                        }
                        style={{ transform: 'scaleY(1.5)' }} // Ajusta el factor de escala según tu necesidad

                      />
                      <CButton
                        color="primary"
                        size="sm"
                        onClick={() => handleEditar(producto)}
                      >
                        Editar
                      </CButton>
                    </CTableDataCell>
                    <CTableDataCell>

                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Editar Producto</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form>
            <div className="mb-3">
              <CFormLabel>Nombre</CFormLabel>
              <CFormInput
                type="text"
                value={selectedProductoId ? selectedProductoId.nombre : ''}
                onChange={(e) =>
                  setSelectedProductoId({
                    ...selectedProductoId,
                    nombre: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Descripcion</CFormLabel>
              <CFormInput
                type="text"
                value={selectedProductoId ? selectedProductoId.descripcion : ''}
                onChange={(e) =>
                  setSelectedProductoId({
                    ...selectedProductoId,
                    descripcion: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Precio Costo</CFormLabel>
              <CFormInput
                type="number"
                value={selectedProductoId ? selectedProductoId.precioCosto : ''}
                onChange={(e) =>
                  setSelectedProductoId({
                    ...selectedProductoId,
                    precioCosto: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <CFormLabel>precio Venta</CFormLabel>
              <CFormInput
                type="number"
                value={selectedProductoId ? selectedProductoId.precioVenta : ''}
                onChange={(e) =>
                  setSelectedProductoId({
                    ...selectedProductoId,
                    precioVenta: e.target.value,
                  })
                }
              />

            </div>
            <div className="mb-3">
              <CFormLabel>Stock</CFormLabel>
              <CFormInput
                type="number"
                value={selectedProductoId ? selectedProductoId.stock : ''}
                onChange={(e) =>
                  setSelectedProductoId({
                    ...selectedProductoId,
                    stock: e.target.value,
                  })
                }
              />

            </div>
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cerrar
          </CButton>
          <CButton color="primary" onClick={handleGuardarCambios}>
            Guardar Cambios
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
}

export default ListaProductos;
