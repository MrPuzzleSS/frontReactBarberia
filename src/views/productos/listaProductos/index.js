import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import ProductoService from '../../services/productoService';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importar los iconos de FontAwesome
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
    estado: "",
    tipoCompra: ""
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

  // const handleCambiarEstado = async (id_producto, estado) => {
  //   try {
  //     await ProductoService.putProducto(id_producto, estado);
  //     fetchProductos();
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Estado cambiado',
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //   } catch (error) {
  //     console.error('Error al cambiar el estado del producto:', error);
  //   }
  // };




  const handleCambiarEstado = (id_producto, estado) => {
    Swal.fire({
      title: `¿Estás seguro de cambiar el estado del producto ${estado}?`,
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cambiar estado"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await ProductoService.putProducto(id_producto, estado);
          const updatedProductos = productos.map(p => {
            if (p.id_producto === id_producto) {
              return { ...p, estado: estado };
            }
            return p;
          });
          setProductos(updatedProductos);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "¡El estado del producto ha sido cambiado exitosamente!",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          console.error("Error al cambiar el estado del producto:", error);
          Swal.fire({
            icon: "error",
            title: "¡Error!",
            text: "Hubo un problema al cambiar el estado del producto.",
          });
        }
      } else {
        // // Si se cancela, volver al estado original del botón
        // const originalEstado = productos.find(p => p.id_producto === id_producto).estado;
        // document.getElementById(`producto${originalEstado}`).checked = true;
      }
    });
  };

  const handleEliminarProducto = async (id_producto) => {
    try {
      const producto = productos.find(producto => producto.id_producto === id_producto); // Buscar el producto por su ID
      if (producto && producto.estado === 'Activo') { // Verificar si el producto existe y está activo
        Swal.fire({
          icon: 'warning',
          title: 'No se puede eliminar',
          text: 'El producto está activo y no se puede eliminar.',
        });
        return; // Salir de la función si el producto está activo
      }

      // Mostrar mensaje de confirmación antes de eliminar
      const result = await Swal.fire({
        icon: 'question',
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) { // Si el usuario confirma la eliminación
        await ProductoService.eliminarProducto(id_producto);
        fetchProductos();
        Swal.fire({
          icon: 'success',
          title: 'Producto eliminado',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };



  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getColorForEstado = (estado) => {
    return estado === "Activo" ? "success" : "danger";
  };


  const getColorForStock = (stock) => {
    if (stock <= 10) {
      return 'red';
    } else if (stock <= 20) {
      return 'orange';
    } else {
      return "";
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
                  <CTableHeaderCell>Tipo</CTableHeaderCell>
                  <CTableHeaderCell>Stock</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentProductos.map((producto) => (
                  <CTableRow key={producto.id_producto}>
                    <CTableDataCell>{producto.nombre}</CTableDataCell>
                    <CTableDataCell>{producto.descripcion}</CTableDataCell>
                    <CTableDataCell>{producto.precioCosto}</CTableDataCell>
                    <CTableDataCell>{producto.precioVenta}</CTableDataCell>
                    <CTableDataCell>{producto.tipoCompra}</CTableDataCell>

                    <CTableDataCell>
                      {producto.stock <= 20 ? (
                        <div
                          className="d-inline-flex align-items-center"
                          style={{
                            backgroundColor: getColorForStock(producto.stock),
                            padding: '5px 10px',
                            borderRadius: '2px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            color: 'white',
                          }}
                        >
                          {producto.stock}
                        </div>
                      ) : (
                        <span>{producto.stock}</span>
                      )}
                    </CTableDataCell>


                    <CTableDataCell style={{ display: "flex", alignItems: "center" }}>
                      <CBadge color={getColorForEstado(producto.estado)} style={{ transform: 'scaleY(1.3)', marginRight: '40px', color: getColorForEstado(producto.estado) }}>{producto.estado}</CBadge>
                      <CFormSwitch
                        size="xl"
                        label=""

                        checked={producto.estado === 'Activo'}
                        onChange={() =>
                          handleCambiarEstado(
                            producto.id_producto,
                            producto.estado === 'Activo' ? 'Inactivo' : 'Activo'
                          )
                        }
                        style={{ transform: 'scaleY(1.2)', marginRight: '10px' }}
                      />
                      <CButton
                        color="secondary"
                        size="sm"
                        onClick={() => handleEditar(producto)}
                        style={{ marginRight: '5px' }} // Ajustar el espacio entre los botones
                      >
                        <FaEdit /> {/* Icono de editar */}
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleEliminarProducto(producto.id_producto)}
                        style={{ marginRight: '5px' }} // Ajustar el espacio entre los botones
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
          <div>
            <CFormLabel>Tipo</CFormLabel>
            <CFormInput
              type="text"
              value={selectedProducto.tipoCompra}
              onChange={(e) => setSelectedProducto({ ...selectedProducto, tipo: e.target.value })}
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
