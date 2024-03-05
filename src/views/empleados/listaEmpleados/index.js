/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
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
  CBadge,
  CFormSelect,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormSwitch,
  CPagination, // Importa CPagination
  CPaginationItem
} from '@coreui/react';
import EmpleadoService from 'src/views/services/empleadoService';

const validateNombre = (value) => {
  return /^[A-Za-z ]+$/.test(value);
};

const validateApellido = (value) => {
  return /^[A-Za-z ]+$/.test(value);
};

const validateCorreo = (value) => {
  return /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(value);
};

const validateDocumento = (value) => {
  return /^\d{1,10}$/.test(value);
};

const validateTelefono = (value) => {
  return /^\d{1,10}$/.test(value);
};

function ListaEmpleados() {

  const navigate = useNavigate();

  const [empleados, setEmpleados] = useState([]);
  const [visible, setVisible] = useState(false);
  const [estadoActivo, setEstadoActivo] = useState(false);
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  useEffect(() => {
    // Obtener la lista de empleados al cargar el componente
    fetchEmpleados();
  }, []);

  const handleGuardarCambios = async () => {
    if (
      validateNombre(selectedEmpleadoId.nombre) &&
      validateApellido(selectedEmpleadoId.apellido) &&
      validateCorreo(selectedEmpleadoId.correo) &&
      validateDocumento(selectedEmpleadoId.documento) &&
      validateTelefono(selectedEmpleadoId.telefono)
    ) {
      try {
        await EmpleadoService.updateEmpleado(
          selectedEmpleadoId.id_empleado,
          selectedEmpleadoId
        );

        // Muestra el SweetAlert de éxito
        Swal.fire('¡Éxito!', 'La modificación ha sido exitosa.', 'success');

        // Cierra el modal
        setVisible(false);

        // Actualiza el array de empleados local con la nueva información
        setEmpleados((prevEmpleados) =>
          prevEmpleados.map((empleado) =>
            empleado.id_empleado === selectedEmpleadoId.id_empleado
              ? selectedEmpleadoId
              : empleado
          )
        );
      } catch (error) {
        console.error('Error al actualizar empleado:', error);
        Swal.fire('Error', 'Hubo un problema al actualizar el empleado.', 'error');
      }
    } else {
      console.error('Error de validación. Por favor, verifica los campos.');
    }
  };

  const fetchEmpleados = async () => {
    try {
      const data = await EmpleadoService.getAllEmpleados();
      const empleadosArray = data.empleados || []; // Si data.empleados es undefined, asigna un array vacío
      const filteredEmpleados = empleadosArray.filter((empleado) => {
        const searchRegex = new RegExp(searchTerm, 'i');
        return (
          searchRegex.test(empleado.nombre) ||
          searchRegex.test(empleado.apellido) ||
          searchRegex.test(empleado.correo) ||
          searchRegex.test(empleado.documento) ||
          searchRegex.test(empleado.telefono) ||
          searchRegex.test(empleado.estado)
        );
      });
      setEmpleados(filteredEmpleados);
      setFilteredEmpleados(filteredEmpleados); // Actualiza los empleados filtrados
      setCurrentPage(1);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    }
  };

  const showAlert = (field, message) => {
    setValidationErrors((prevErrors) => ({ ...prevErrors, [field]: message }));
  };

  const clearAlerts = () => {
    setValidationErrors({});
  };

  const handleEditar = (empleado) => {
    // Abrir el modal y almacenar el ID del empleado seleccionado
    setSelectedEmpleadoId(empleado);
    clearAlerts();
    setVisible(true);
  };


  const handleCambiarEstadoSwitch = async (id_empleado) => {
    try {
      // Cambiar el estado del empleado
      await EmpleadoService.cambiarEstadoEmpleado(id_empleado);
  
      // Actualizar la lista de empleados
      await fetchEmpleados();
  
      // Mostrar una alerta de éxito
      Swal.fire('¡Cambiado!', 'El estado del empleado ha sido modificado.', 'success');
  
      // Cambiar el estado del interruptor al contrario de su valor actual
      setEstadoActivo((prevEstado) => !prevEstado);
    } catch (error) {
      console.error('Error al cambiar el estado del empleado:', error);
      Swal.fire('Error', 'Hubo un problema al cambiar el estado del empleado.', 'error');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastEmpleado = currentPage * pageSize;
  const indexOfFirstEmpleado = indexOfLastEmpleado - pageSize;
  const currentEmpleados = filteredEmpleados.slice(indexOfFirstEmpleado, indexOfLastEmpleado);

  function getColorForEstado(estado) {
    if (estado === "Activo") {
      return "success";
    } else if (estado === "Inactivo") {
      return "danger";
    } else {
      return "default";
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Lista de Empleados</strong>
              <Link to="/empleados/crearEmpleados">
                <CButton color="primary">Agregar Empleados</CButton>
              </Link>
            </div>
          <div className="mt-3">
          <CInputGroup className="mt-3" style={{ maxWidth: "200px" }}>
          <CFormInput
            type="text"
            placeholder="Buscar..."
            className="form-control-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              // Llama a la función de búsqueda cuando cambia el término.
              fetchEmpleados();
            }}
          />
          </CInputGroup>
          </div>
          </CCardHeader>
          <CCardBody>
            <CTable align='middle' className='mb-0 border' hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Apellido</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Correo</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Documento</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Telefono</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
              {currentEmpleados.map((empleado, index) => (
              <CTableRow key={empleado.id_empleado}>
                <CTableHeaderCell scope="row">{indexOfFirstEmpleado + index + 1}</CTableHeaderCell>
                    <CTableDataCell>{empleado.nombre}</CTableDataCell>
                    <CTableDataCell>{empleado.apellido}</CTableDataCell>
                    <CTableDataCell>{empleado.correo}</CTableDataCell>
                    <CTableDataCell>{empleado.documento}</CTableDataCell>
                    <CTableDataCell>{empleado.telefono}</CTableDataCell>
                    <CTableDataCell><CBadge color={getColorForEstado(empleado.estado)}>{empleado.estado}</CBadge></CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup aria-label="Basic mixed styles example">
                      <CFormSwitch
                          size='xl'
                          label=""
                          id={`formSwitchCheckChecked_${empleado.id_empleado}`}
                          defaultChecked={empleado.estado === 'Activo'}
                          onChange={() => handleCambiarEstadoSwitch(empleado.id_empleado)}
                        />
                        <CButton
                        color="secondary"
                        size="sm"
                        onClick={() => handleEditar(empleado)}
                        style={{ marginRight: '5px' }} // Ajustar el espacio entre los botones
                      >
                        <FaEdit /> {/* Icono de editar */}
                      </CButton>
                      </CButtonGroup>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CPagination align="center" aria-label="Page navigation example" className="mt-3">
              <CPaginationItem onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Anterior
              </CPaginationItem>
              {Array.from({ length: Math.ceil(filteredEmpleados.length / pageSize) }, (_, i) => (
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
                disabled={currentPage === Math.ceil(filteredEmpleados.length / pageSize)}
              >
                Siguiente
              </CPaginationItem>
            </CPagination>
          </CCardBody>
        </CCard>
      </CCol>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Editar Empleados</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={e => {
            e.preventDefault()
            console.log(selectedEmpleadoId)
          }}>

            <div className="mb-3">
              <CFormLabel>Nombre</CFormLabel>
              <CFormInput
                type="text"
                value={selectedEmpleadoId?.nombre}
                onChange={(e) => {
                  const newValue = { ...selectedEmpleadoId };
                  if (validateNombre(e.target.value)) {
                    newValue.nombre = e.target.value;
                    showAlert('nombre', '');
                  } else {
                    showAlert('nombre', 'El nombre debe contener solo letras');
                  }
                  setSelectedEmpleadoId(newValue);
                }}
              />
              {validationErrors.nombre && (
                <div className="alert alert-danger mt-2">{validationErrors.nombre}</div>
              )}
            </div>

            <div className="mb-3">
              <CFormLabel>Apellido</CFormLabel>
              <CFormInput
                type="text"
                value={selectedEmpleadoId?.apellido}
                onChange={(e) => {
                  const newValue = { ...selectedEmpleadoId };
                  if (validateApellido(e.target.value)) {
                    newValue.apellido = e.target.value;
                    showAlert('apellido', ''); // Limpiar la alerta si la validación es exitosa
                  } else {
                    showAlert('apellido', 'El apellido debe contener solo letras');
                  }
                  setSelectedEmpleadoId(newValue);
                }}
              />
              {validationErrors.apellido && (
                <div className="alert alert-danger mt-2">{validationErrors.apellido}</div>
              )}
            </div>

            <div className="mb-3">
              <CFormLabel>Correo</CFormLabel>
              <CFormInput
                type="email"
                value={selectedEmpleadoId?.correo}
                onChange={(e) => {
                  const newValue = { ...selectedEmpleadoId };
                  if (validateCorreo(e.target.value)) {
                    newValue.correo = e.target.value;
                    showAlert('correo', ''); // Limpiar la alerta si la validación es exitosa
                  } else {
                    showAlert('correo', 'Correo electrónico no válido');
                  }
                  setSelectedEmpleadoId(newValue);
                }}
              />
              {validationErrors.correo && (
                <div className="alert alert-danger mt-2">{validationErrors.correo}</div>
              )}
            </div>

            <div className="mb-3">
              <CFormLabel>Documento</CFormLabel>
              <CFormInput
                type="number"
                value={selectedEmpleadoId?.documento}
                onChange={(e) => {
                  const newValue = { ...selectedEmpleadoId };
                  newValue.documento = e.target.value;
                  if (newValue.documento.length > 10) {
                    showAlert('documento', 'El documento no puede contener más de 10 dígitos');
                  } else {
                    showAlert('documento', ''); // Limpiar la alerta si la validación es exitosa
                  }
                  setSelectedEmpleadoId(newValue);
                }}
              />
              {validationErrors.documento && (
                <div className="alert alert-danger mt-2">{validationErrors.documento}</div>
              )}
            </div>

            <div className="mb-3">
              <CFormLabel>Telefono</CFormLabel>
              <CFormInput
                type="number"
                value={selectedEmpleadoId?.telefono}
                onChange={(e) => {
                  const newValue = { ...selectedEmpleadoId };
                  newValue.telefono = e.target.value;
                  if (newValue.telefono.length > 10) {
                    showAlert('telefono', 'El teléfono no puede contener más de 10 dígitos');
                  } else {
                    showAlert('telefono', ''); // Limpiar la alerta si la validación es exitosa
                  }
                  setSelectedEmpleadoId(newValue);
                }}
              />
              {validationErrors.telefono && (
                <div className="alert alert-danger mt-2">{validationErrors.telefono}</div>
              )}
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
  )
}

export default ListaEmpleados
