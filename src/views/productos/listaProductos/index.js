import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import ProductoService from '../../services/productoService';
import { FaEdit, FaTrash, } from 'react-icons/fa'; // Importar los iconos de FontAwesome
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CFormLabel,
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
  CFormInput,
  CFormSwitch,
  CPagination,
  CPaginationItem,
  CBadge,
  CInputGroup,
} from '@coreui/react';

function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState({
    id_producto: "",
    nombre: "",
    descripcion: "",
    precioCosto: "",
    precioVenta: "",
    stock: "",
    estado: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [filteredProductos, setFilteredProductos] = useState([]);

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

  const handleEditar = (producto) => {
    console.log('Editar producto:', producto);
    if (producto.estado === 'Inactivo') {
      Swal.fire({
        icon: 'warning',
        title: 'Producto inactivo',
        text: 'No se puede editar un producto inactivo.',
      });
      return;
    }
    setSelectedProducto(producto);
    setVisible(true); // Asegúrate de establecer visible en true
  };

  const handleGuardarCambios = async () => {
    try {
      if (selectedProducto && selectedProducto.id_producto) {
        await ProductoService.updateProducto(selectedProducto.id_producto, selectedProducto);
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
      await ProductoService.putProducto(id_producto, estado);
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

  

  const handleEliminarProducto = async (id_producto) => {
    try {
      // Obtener el producto
      const producto = await ProductoService.getProductoById(id_producto);

      // Verificar si el producto está inactivo
      if (producto.estado === 'Inactivo') {
        throw new Error('No se puede eliminar un producto inactivo.');
      }

      // Si el producto no está inactivo, proceder con la eliminación
      await ProductoService.eliminarProducto(id_producto);
      fetchProductos();
      Swal.fire({
        icon: 'success',
        title: 'Producto eliminado',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      // Mostrar mensaje de error en caso de que el producto esté inactivo
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar el producto',
        text: error.message, // Mostrar el mensaje de error
      });
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Función para determinar el color basado en el estado del producto
  const getColorForEstado = (estado) => {
    return estado === "Activo" ? "success" : "danger";
  };


  const getColorForCantidad = (cantidad) => {
    if (cantidad <= 10) {
      return "danger"; // Rojo
    } else if (cantidad <= 20) {
      return "warning"; // Naranja
    } else {
      return ""; // Sin color
    }
  };

  useEffect(() => {
    const filteredProductos = productos.filter((producto) => {
      const nombreMatches = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const descripcionMatches = producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      return nombreMatches || descripcionMatches;
    });
    setFilteredProductos(filteredProductos);
  }, [productos, searchTerm]);

  const indexOfLastProducto = currentPage * pageSize;
  const indexOfFirstProducto = indexOfLastProducto - pageSize;
  const currentProductos = filteredProductos.slice(indexOfFirstProducto, indexOfLastProducto);

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
            <CInputGroup className="mt-2">
              <CCol xs={3}>
                <CFormInput
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CCol>
            </CInputGroup>
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
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentProductos.map((producto) => (
                  <CTableRow key={producto.id_producto}>
                    <CTableDataCell>{producto.nombre}</CTableDataCell>
                    <CTableDataCell>{producto.descripcion}</CTableDataCell>
                    <CTableDataCell>{producto.precioCosto}</CTableDataCell>
                    <CTableDataCell>{producto.precioVenta}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getColorForCantidad(producto.stock)}>{producto.stock}</CBadge>
                    </CTableDataCell>

                    <CTableDataCell style={{ display: "flex", alignItems: "center" }}>
                      <CBadge color={getColorForEstado(producto.estado)} style={{ transform: 'scaleY(1.3)', marginRight: '25px', color: getColorForEstado(producto.estado) }}>{producto.estado}</CBadge>
                      <CFormSwitch
                        checked={producto.estado === 'Activo'}
                        onChange={() =>
                          handleCambiarEstado(
                            producto.id_producto,
                            producto.estado === 'Activo' ? 'Inactivo' : 'Activo'
                          )
                        }
                        style={{ transform: 'scaleY(1.5)' }}
                      />
                      <CButton
                        color="primary"
                        size="sm"
                        onClick={() => handleEditar(producto)}
                        style={{ marginLeft: '10px' }} // Ajustar el espacio entre los botones
                      >
                        <FaEdit /> {/* Icono de editar */}
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleEliminarProducto(producto.id_producto)}
                        style={{ marginLeft: '10px' }} // Ajustar el espacio entre los botones
                      >
                        <FaTrash /> {/* Icono de eliminar */}
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CPagination align="center" aria-label="Page navigation example" className="mt-3">
              <CPaginationItem onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Anterior</CPaginationItem>
              {Array.from({ length: Math.ceil(filteredProductos.length / pageSize) }, (_, i) => (
                <CPaginationItem
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  active={i + 1 === currentPage}
                >
                  {i + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === Math.ceil(filteredProductos.length / pageSize)}>Siguiente</CPaginationItem>
            </CPagination>
          </CCardBody>
        </CCard>
      </CCol>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Editar Producto</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>
            <CFormLabel>Nombre</CFormLabel>
            <CFormInput
              type="text"
              value={selectedProducto.nombre}
              onChange={(e) => setSelectedProducto({ ...selectedProducto, nombre: e.target.value })}
            />
          </div>
          <div>
            <CFormLabel>Descripción</CFormLabel>
            <CFormInput
              type="text"
              value={selectedProducto.descripcion}
              onChange={(e) => setSelectedProducto({ ...selectedProducto, descripcion: e.target.value })}
            />
          </div>
          <div>
            <CFormLabel>Precio Costo</CFormLabel>
            <CFormInput
              type="number"
              value={selectedProducto.precioCosto}
              onChange={(e) => setSelectedProducto({ ...selectedProducto, precioCosto: e.target.value })}
            />
          </div>
          <div>
            <CFormLabel>Precio Venta</CFormLabel>
            <CFormInput
              type="number"
              value={selectedProducto.precioVenta}
              onChange={(e) => setSelectedProducto({ ...selectedProducto, precioVenta: e.target.value })}
            />
          </div>
          <div>
            <CFormLabel>Stock</CFormLabel>
            <CFormInput
              type="number"
              value={selectedProducto.stock}
              onChange={(e) => setSelectedProducto({ ...selectedProducto, stock: e.target.value })}
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleGuardarCambios}>Guardar cambios</CButton>
          <CButton color="secondary" onClick={() => setVisible(false)}>Cancelar</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
}

export default ListaProductos;
