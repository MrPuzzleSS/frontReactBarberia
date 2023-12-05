/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CButtonGroup,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CFormInput,
} from '@coreui/react';
import ProductoService from 'src/views/services/productoService';

function ListaProductos() {
  const [visible, setVisible] = useState(false);
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]); 
  const [selectedProductoId, setSelectedProductoId] = useState(null); // Agregamos el estado para el ID del producto seleccionado

  useEffect(() => {
    fetchProductos();
    fetchProveedores(); 
  }, []);

  const fetchProductos = async () => {
    try {
      const data = await ProductoService.getAllProductos();
      setProductos(data.productos);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const handleEditar = (producto) => {
    setSelectedProductoId(producto); // Establecer el producto seleccionado en selectedProductoId
    setVisible(true);
  };

  const handleEliminar = async (id_producto) => {
    try {
      await ProductoService.eliminarProducto(id_producto);
      fetchProductos();
      Swal.fire({
        icon: 'success',
        title: 'Producto eliminado',
        showConfirmButton: false,
        timer: 1500, // El mensaje se mostrará por 1.5 segundos
      });
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };
  const handleGuardarCambios = async () => {
    try {
      await ProductoService.updateProducto(selectedProductoId.id_producto, selectedProductoId);
      fetchProductos();
      setVisible(false);
      Swal.fire({
        icon: 'success',
        title: 'Cambios guardados',
        showConfirmButton: false,
        timer: 1500, // El mensaje se mostrará por 1.5 segundos
      });
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    }
  };
  const fetchProveedores = async () => {
    try {
      const proveedoresData = await ProductoService.obtenerProveedores(); // Obtiene los proveedores
      setProveedores(proveedoresData); // Establece los proveedores en el estado
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
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
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Proveedor</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Descripción</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Precio</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Stock</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {productos.map((producto, index) => (
                  <CTableRow key={producto.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{producto.id_proveedor}</CTableDataCell>
                    <CTableDataCell>{producto.nombre}</CTableDataCell>
                    <CTableDataCell>{producto.descripcion}</CTableDataCell>
                    <CTableDataCell>{producto.precio}</CTableDataCell>
                    <CTableDataCell>{producto.stock}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup aria-label="Basic mixed styles example">
                        <CButton
                          color="info"
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditar(producto)}
                        >
                          Editar
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          variant="outline"
                          onClick={() => handleEliminar(producto.id_producto)}
                        >
                          Eliminar
                        </CButton>
                      </CButtonGroup>
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
        <CFormLabel>Descripción</CFormLabel>
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
        <CFormLabel>Precio</CFormLabel>
        <CFormInput
          type="number"
          value={selectedProductoId ? selectedProductoId.precio : ''}
          onChange={(e) =>
            setSelectedProductoId({
              ...selectedProductoId,
              precio: e.target.value,
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
