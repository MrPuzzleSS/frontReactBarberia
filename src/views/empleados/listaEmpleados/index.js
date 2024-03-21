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
  CPagination,
  CPaginationItem,
} from '@coreui/react';
import EmpleadoService from 'src/views/services/empleadoService';


function ListaEmpleados() {

  const navigate = useNavigate();

  const [empleados, setEmpleados] = useState([]);
  const [visible, setVisible] = useState(false);
  const [estadoActivo, setEstadoActivo] = useState(false);
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState({});
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [allowSave, setAllowSave] = useState(false);
  const [estadoOriginal, setEstadoOriginal] = useState(false);
  const [empleadoToDeleteId, setEmpleadoToDeleteId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [validationErrors, setValidationErrors] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    telefono: '',
    correo: '',
  });



  useEffect(() => {
    // Obtener la lista de empleados al cargar el componente
    fetchEmpleados();
    // Al cargar el componente, establecer el estado original solo una vez
    setEstadoOriginal(selectedEmpleadoId.estado === 'Activo');
  }, [selectedEmpleadoId.estado]);



  const handleGuardarCambios = async () => {
    const fieldValidation = {};
    let isValid = true;

    if (!selectedEmpleadoId.nombre.trim()) {
      fieldValidation.nombre = 'El nombre es requerido.';
      isValid = false;
    } else {
      fieldValidation.nombre = /^[a-zA-Z0-9\s]*$/.test(selectedEmpleadoId.nombre)
        ? ''
        : 'Nombre no válido. Solo se permiten letras, números y espacios.';
    }

    if (!selectedEmpleadoId.apellido.trim()) {
      fieldValidation.apellido = 'El apellido es requerido.';
      isValid = false;
    } else {
      fieldValidation.apellido = /^[a-zA-Z\s]*$/.test(selectedEmpleadoId.apellido)
        ? ''
        : 'El apellido solo debe contener letras y espacios.';
    }

    if (!selectedEmpleadoId.correo.trim()) {
      fieldValidation.correo = 'El correo es requerido.';
      isValid = false;
    }

    if (!selectedEmpleadoId.documento.trim()) {
      fieldValidation.documento = 'El documento es requerido.';
      isValid = false;
    } else if (!/^\d{6,10}$/.test(selectedEmpleadoId.documento.trim())) {
      fieldValidation.documento = 'El documento debe tener entre 6 y 10 dígitos.';
      isValid = false;
    }

    if (!selectedEmpleadoId.telefono.trim()) {
      fieldValidation.telefono = 'El teléfono es requerido.';
      isValid = false;
    } else if (!/^\d{10}$/.test(selectedEmpleadoId.telefono.trim())) {
      fieldValidation.telefono = 'El teléfono debe tener 10 dígitos.';
      isValid = false;
    }

    setValidationErrors(fieldValidation);
    setAllowSave(isValid);

    if (!isValid) {
      return;
    }

    try {
      await EmpleadoService.updateEmpleado(
        selectedEmpleadoId.id_empleado,
        selectedEmpleadoId
      );

      Swal.fire('¡Éxito!', 'La modificación ha sido exitosa.', 'success');

      setEmpleados((prevEmpleados) =>
      prevEmpleados.map((empleado) =>
        empleado.id_empleado === selectedEmpleadoId.id_empleado
          ? selectedEmpleadoId
          : empleado
      )
    );

    setFilteredEmpleados((prevFilteredEmpleados) =>
      prevFilteredEmpleados.map((empleado) =>
        empleado.id_empleado === selectedEmpleadoId.id_empleado
          ? selectedEmpleadoId
          : empleado
      )
    );
  
      setValidationErrors({
        nombre: '',
        apellido: '',
        documento: '',
        telefono: '',
        correo: '',
      });

      setVisible(false);
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      Swal.fire('Error', 'Hubo un problema al actualizar el empleado.', 'error');
    }
  };


  const handleShoweleteConfimation = (id_empleado) => {
    setEmpleadoToDeleteId(id_empleado);
    setShowDeleteConfirmation(true);
  };
  const handleEliminarEmpleado = async (id_empleado) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
      });

      if (result.isConfirmed) {
        await EmpleadoService.eliminarEmpleado(id_empleado);
        await fetchEmpleados();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'El empleado ha sido eliminado correctamente.',
        });
      }
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al eliminar el empleado. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  };




  const fetchEmpleados = async () => {
    try {
      const data = await EmpleadoService.getAllEmpleados();
      const empleadosArray = data.empleados || [];
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
      setFilteredEmpleados(filteredEmpleados);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    }
  };



  const handleInputChange = (e, fieldName) => {
    const rawValue = e.target.value;
    let filteredValue;

    if (fieldName === 'correo') {
      filteredValue = rawValue;
    } else {
      filteredValue = filterValidCharacters(rawValue);
    }

    let isValid = true;
    const fieldValidation = { ...validationErrors };

    switch (fieldName) {
      case 'nombre':
        if (!filteredValue) {
          fieldValidation.nombre = 'El nombre es requerido.';
          isValid = false;
        } else {
          fieldValidation.nombre = /^[a-zA-Z0-9\s]*$/.test(filteredValue)
            ? ''
            : 'Nombre no válido. Solo se permiten letras, números y espacios.';
        }
        break;

      case 'apellido':
        if (!filteredValue) {
          fieldValidation.apellido = 'El apellido es requerido.';
          isValid = false;
        } else {
          fieldValidation.apellido = /^[a-zA-Z\s]*$/.test(filteredValue)
            ? ''
            : 'El apellido solo debe contener letras y espacios.';
        }
        break;

      case 'correo':
        if (!filteredValue) {
          fieldValidation.correo = 'El correo es requerido.';
          isValid = false;
        } else {
          fieldValidation.correo = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(filteredValue)
            ? ''
            : 'Ingrese un correo válido.';
        }
        break;

      case 'documento':
        fieldValidation.documento = filteredValue
          ? /^\d{6,10}$/.test(filteredValue)
            ? ''
            : 'El documento debe tener entre 6 y 10 dígitos.'
          : 'El documento es requerido.';
        break;

      case 'telefono':
        fieldValidation.telefono = filteredValue
          ? /^\d{10}$/.test(filteredValue)
            ? ''
            : 'El teléfono debe tener 10 dígitos.'
          : 'El teléfono es requerido.';
        break;
      default:
        break;
    }

    setSelectedEmpleadoId({ ...selectedEmpleadoId, [fieldName]: filteredValue });

    isValid = Object.values(fieldValidation).every((error) => !error);
    setAllowSave(isValid);
    setValidationErrors(fieldValidation);
  };

  const filterValidCharacters = (input, allowSpecialChars = false) => {
    if (allowSpecialChars) {
      return input;
    }
    return input.replace(/[^a-zA-Z0-9\s]/g, '');
  };



  const handleEditar = (empleado) => {
    setSelectedEmpleadoId(empleado);
    setVisible(true);
  };



  const handleCambiarEstadoSwitch = async (id_empleado) => {
    try {
      const empleadoActual = empleados.find((emp) => emp.id_empleado === id_empleado);
      const nuevoEstado = empleadoActual.estado === 'Activo' ? 'Inactivo' : 'Activo';
      const result = await Swal.fire({
        title: `¿Estás seguro de cambiar el estado del empleado a ${nuevoEstado}?`,
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, cambiar estado"
      });
      if (result.isConfirmed) {
        await EmpleadoService.cambiarEstadoEmpleado(id_empleado);
        await fetchEmpleados();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "¡El estado del empleado ha sido cambiado exitosamente!",
          showConfirmButton: false,
          timer: 1500,
        });
        const empleadoActualizado = empleados.find((emp) => emp.id_empleado === id_empleado);
        const nuevoEstadoActual = empleadoActualizado.estado === 'Activo';
        setEstadoActivo(nuevoEstadoActual);
      } else {
        const boton = document.getElementById(`formSwitchCheckChecked_${id_empleado}`);
        if (boton) {
          boton.checked = empleadoActual.estado === 'Activo';
        } else {
          console.error('Error: Elemento del botón no encontrado');
        }
      }
    } catch (error) {
      console.error('Error al cambiar el estado del empleado:', error);
      Swal.fire('Error', 'Hubo un problema al cambiar el estado del empleado.', 'error');
    }
  };



  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  //paginado
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
                  placeholder="Buscar empleados..."
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
                  <CTableHeaderCell scope="col">Documento</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Apellido</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Correo</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Telefono</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                  <CTableHeaderCell scope="col"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
              {currentEmpleados.map((empleado, index) => (
              <CTableRow key={empleado.id_empleado}>
                    <CTableDataCell>{empleado.documento}</CTableDataCell>
                    <CTableDataCell>{empleado.nombre}</CTableDataCell>
                    <CTableDataCell>{empleado.apellido}</CTableDataCell>
                    <CTableDataCell>{empleado.correo}</CTableDataCell>
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
                          style={{ marginRight: '5px' }}
                        >
                          <FaEdit />
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => handleEliminarEmpleado(empleado.id_empleado)}
                        >
                          <FaTrash />
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
      <CModal visible={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)} backdrop="static">
      </CModal>
      <CModal visible={visible} onClose={() => setVisible(false)} backdrop="static">
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
                value={selectedEmpleadoId?.nombre || ''}
                onChange={(e) => handleInputChange(e, 'nombre')}
              />
              {validationErrors.nombre && <small className="text-danger">{validationErrors.nombre}</small>}
            </div>

            <div className="mb-3">
              <CFormLabel>Apellido</CFormLabel>
              <CFormInput
                type="text"
                value={selectedEmpleadoId?.apellido || ''}
                onChange={(e) => handleInputChange(e, 'apellido')}
              />
              {validationErrors.apellido && <small className="text-danger">{validationErrors.apellido}</small>}
            </div>

            <div className="mb-3">
              <CFormLabel>Correo</CFormLabel>
              <CFormInput
                type="correo"
                value={selectedEmpleadoId?.correo || ''}
                onChange={(e) => handleInputChange(e, 'correo')}
              />
              {validationErrors.correo && <small className="text-danger">{validationErrors.correo}</small>}
            </div>

            <div className="mb-3">
              <CFormLabel>Documento</CFormLabel>
              <CFormInput
                type="number"
                minLength={6}
                maxLength={10}
                value={selectedEmpleadoId?.documento || ''}
                onChange={(e) => handleInputChange(e, 'documento')}
              />
              {validationErrors.documento && <small className="text-danger">{validationErrors.documento}</small>}
            </div>

            <div className="mb-3">
              <CFormLabel>Telefono</CFormLabel>
              <CFormInput
                type="number"
                maxLength={10}
                value={selectedEmpleadoId?.telefono || ''}
                onChange={(e) => handleInputChange(e, 'telefono')}
              />
              {validationErrors.telefono && <small className="text-danger">{validationErrors.telefono}</small>}
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
