import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import ProveedoresDataService from "src/views/services/ProveedoresService";
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CFormInput,
  CFormSwitch,
  CInputGroup,
  CBadge,
  CPagination,
  CPaginationItem
} from "@coreui/react";

function ListaProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState({
    id: "",
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
    tipo_de_producto_servicio: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const respuesta = await ProveedoresDataService.getAll(); // Utiliza la función getAll del servicio
        setProveedores(respuesta.data.listProveedores);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (proveedor) => {
    setEditingProveedor(proveedor);
    setVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProveedor((prevProveedor) => ({
      ...prevProveedor,
      [name]: value,
    }));
  };

  const handleGuardarCambios = async () => {
    try {
      const response = await ProveedoresDataService.update(
        editingProveedor.id_proveedor,
        editingProveedor,
      );

      // Actualizar la lista después de la edición exitosa
      const updatedProveedores = proveedores.map((proveedor) =>
        proveedor.id_proveedor === editingProveedor.id_proveedor
          ? response.data.proveedor
          : proveedor,
      );

      setProveedores(updatedProveedores);
      setVisible(false);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Proveedor editado correctamente",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error al actualizar el proveedor:", error);
      // Puedes manejar el error de alguna manera (mostrar un mensaje, etc.)
    }
  };

  // Filtrar proveedores basado en el término de búsqueda
  const filteredProveedores = proveedores.filter((proveedor) => {
    const nombreMatches = proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const direccionMatches = proveedor.direccion.toLowerCase().includes(searchTerm.toLowerCase());
    const telefonoMatches = proveedor.telefono.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatches = proveedor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const tipoMatches = proveedor.tipo_de_producto_servicio.toLowerCase().includes(searchTerm.toLowerCase());

    return nombreMatches || direccionMatches || telefonoMatches || emailMatches || tipoMatches;
  }
  );

  const indexOfLastProveedor = currentPage * pageSize;
  const indexOfFirstProveedor = indexOfLastProveedor - pageSize;
  const currentProveedores = filteredProveedores.slice(indexOfFirstProveedor, indexOfLastProveedor);

  function getColorForEstado(estado) {
    if (estado === "Activo") {
      return "success";
    } else if (estado === "Inactivo") {
      return "danger";
    } else {
      return "default";
    }
  }

  const handleEstadoChange = (proveedor) => {
    const nuevoEstado = proveedor.estado === 'Activo' ? 'Inactivo' : 'Activo';
    ProveedoresDataService.cambiarEstado(proveedor.id_proveedor, { estado: nuevoEstado });

    const updatedProveedores = proveedores.map(p => {
      if (p.id_proveedor === proveedor.id_proveedor) {
        return { ...p, estado: nuevoEstado };
      }
      return p;
    });
    setProveedores(updatedProveedores);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Lista de Proveedores</strong>
              <Link to="/proveedores/crear-proveedor">
                <CButton color="success">Agregar Proveedor</CButton>
              </Link>
            </div>
            <div className="mt-3">
              <CInputGroup className="mt-3" style={{ maxWidth: "200px" }}>
                <CFormInput
                  type="text"
                  placeholder="Buscar proveedor..."
                  className="form-control-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </div>
          </CCardHeader>
          <CCardBody>
            <CTable align="middle" className="mb-0 border" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Dirección</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
                  <CTableHeaderCell scope="col">
                    Correo Electrónico
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">
                    Producto o Servicio
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentProveedores.map((proveedor, i) => (
                  <CTableRow key={proveedor.id_proveedor}>
                    <CTableHeaderCell scope="row">{proveedor.id_proveedor}</CTableHeaderCell>
                    <CTableDataCell>{proveedor.nombre}</CTableDataCell>
                    <CTableDataCell>{proveedor.direccion}</CTableDataCell>
                    <CTableDataCell>{proveedor.telefono}</CTableDataCell>
                    <CTableDataCell>{proveedor.email}</CTableDataCell>
                    <CTableDataCell>
                      {proveedor.tipo_de_producto_servicio}
                    </CTableDataCell>
                    <CTableDataCell><CBadge color={getColorForEstado(proveedor.estado)}>{proveedor.estado}</CBadge></CTableDataCell>
                    <CTableDataCell
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <CFormSwitch
                        size="xl"
                        label=""
                        id={`cambiarEstado-${proveedor.id_proveedor}`}
                        defaultChecked={proveedor.estado === 'Activo'}
                        onChange={() => handleEstadoChange(proveedor)}
                      />
                      <CButton
                        color="primary"
                        size="sm"
                        onClick={() => handleEditClick(proveedor)}
                      >
                        Editar
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CPagination align="center" aria-label="Page navigation example" className="mt-3">
              <CPaginationItem onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}>Anterior</CPaginationItem>
              {Array.from({ length: Math.ceil(filteredProveedores.length / pageSize) }, (_, i) => (
                <CPaginationItem
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  active={i + 1 === currentPage}
                >
                  {i + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredProveedores.length / pageSize)}
              >
                Siguiente
              </CPaginationItem>
            </CPagination>
          </CCardBody>
        </CCard>
      </CCol>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Editar Proveedor</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form>
            <div className="mb-3">
              <CFormLabel>Nombre</CFormLabel>
              <CFormInput
                type="text"
                name="nombre"
                value={editingProveedor.nombre}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Dirección</CFormLabel>
              <CFormInput
                type="text"
                name="direccion"
                value={editingProveedor.direccion}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Teléfono</CFormLabel>
              <CFormInput
                type="tel"
                name="telefono"
                value={editingProveedor.telefono}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Correo Electrónico</CFormLabel>
              <CFormInput
                type="email"
                name="email"
                value={editingProveedor.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Tipo de Producto o Servicio</CFormLabel>
              <CFormInput
                type="text"
                name="tipo_de_producto_servicio"
                value={editingProveedor.tipo_de_producto_servicio}
                onChange={handleInputChange}
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

export default ListaProveedores;
