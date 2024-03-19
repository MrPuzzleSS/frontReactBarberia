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
  CFormSelect,
  CFormSwitch,
  CInputGroup,
  CBadge,
  CPagination,
  CPaginationItem
} from "@coreui/react";
import { FaEdit } from 'react-icons/fa';

function ListaProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState({
    id: "",
    tipo_documento: "",
    num_documento: "",
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [forceRerender, setForceRerender] = useState(false);

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
  }, [forceRerender]);

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
          ? response.data.proveedor // Usar el proveedor editado del response
          : proveedor,
      );

      setProveedores(updatedProveedores); // Actualizar la lista de proveedores
      setVisible(false);
      setForceRerender(!forceRerender); // Forzar el re-renderizado de la tabla

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
    if (!proveedor) return false; // Verifica si proveedor es undefined o null
    const nombreMatches = proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const direccionMatches = proveedor.direccion.toLowerCase().includes(searchTerm.toLowerCase());
    const telefonoMatches = proveedor.telefono.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatches = proveedor.email.toLowerCase().includes(searchTerm.toLowerCase());
  
    return nombreMatches || direccionMatches || telefonoMatches || emailMatches;
  });
  

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
    Swal.fire({
      title: `¿Estás seguro de cambiar el estado del proveedor a ${nuevoEstado}?`,
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cambiar estado"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await ProveedoresDataService.cambiarEstado(proveedor.id_proveedor, { estado: nuevoEstado });
          const updatedProveedores = proveedores.map(p => {
            if (p.id_proveedor === proveedor.id_proveedor) {
              return { ...p, estado: nuevoEstado };
            }
            return p;
          });
          setProveedores(updatedProveedores);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "¡El estado del proveedor ha sido cambiado exitosamente!",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          console.error("Error al cambiar el estado del proveedor:", error);
          Swal.fire({
            icon: "error",
            title: "¡Error!",
            text: "Hubo un problema al cambiar el estado del proveedor.",
          });
        }
      } else {
        // Si se cancela, volver al estado original del botón
        document.getElementById(`cambiarEstado-${proveedor.id_proveedor}`).checked = proveedor.estado === 'Activo';
      }
    });
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
                <CButton color="primary">Agregar Proveedor</CButton>
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
                  <CTableHeaderCell scope="col">Tipo de Documento</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Documento</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Dirección</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
                  <CTableHeaderCell scope="col">
                    Correo Electrónico
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                  <CTableHeaderCell scope="col"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentProveedores.map((proveedor, i) => (
                  <CTableRow key={proveedor.id_proveedor} >
                    <CTableDataCell>{proveedor.tipo_documento}</CTableDataCell>
                    <CTableDataCell>{proveedor.num_documento}</CTableDataCell>
                    <CTableDataCell>{proveedor.nombre}</CTableDataCell>
                    <CTableDataCell>{proveedor.direccion}</CTableDataCell>
                    <CTableDataCell>{proveedor.telefono}</CTableDataCell>
                    <CTableDataCell>{proveedor.email}</CTableDataCell>
                    <CTableDataCell><CBadge color={getColorForEstado(proveedor.estado)}>{proveedor.estado}</CBadge></CTableDataCell>
                    <CTableDataCell
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <CFormSwitch
                        size="xl"
                        label=""
                        id={`cambiarEstado-${proveedor.id_proveedor}`}
                     defaultChecked   ={proveedor.estado === 'Activo'}
                        onChange={() => handleEstadoChange(proveedor)}
                      />
                      <CButton
                        color="secondary"
                        size="sm"
                        onClick={() => handleEditClick(proveedor)}
                      >
                        <FaEdit style={{ color: 'black' }} /> 
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
      <CModal backdrop="static" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Editar Proveedor</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form>
            <div className="mb-3">
              <CFormLabel>Tipo de Documento</CFormLabel>
              <CFormSelect
                type="text"
                name="tipo_documento"
                value={editingProveedor.tipo_documento}
                onChange={handleInputChange}
              />
            </div>
          <div className="mb-3">
              <CFormLabel>Documento</CFormLabel>
              <CFormInput
                type="text"
                name="nombre"
                value={editingProveedor.num_documento}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Nombre</CFormLabel>
              <CFormInput
                type="text"
                name="nombre"
                value={editingProveedor.nombre}
                onChange={handleInputChange}
                disabled
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
                disabled
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
