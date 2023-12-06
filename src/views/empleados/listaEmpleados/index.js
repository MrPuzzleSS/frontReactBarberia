/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
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
  CFormSelect,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';
import EmpleadoService from 'src/views/services/empleadoService';

function ListaEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState({});

  useEffect(() => {
    // Obtener la lista de empleados al cargar el componente
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const data = await EmpleadoService.getAllEmpleados();
      setEmpleados(data.empleados);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    }
  };

  const handleEditar = (empleado) => {
    // Abrir el modal y almacenar el ID del empleado seleccionado
    setSelectedEmpleadoId(empleado);
    setVisible(true);
  };

  const handleCambiarEstado = async (id_empleado) => {
    try {
      // Cambiar el estado del empleado y actualizar la lista
      await EmpleadoService.cambiarEstadoEmpleado(id_empleado);
      fetchEmpleados();
    } catch (error) {
      console.error('Error al cambiar el estado del empleado:', error);
    }
  };

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
                {empleados && empleados.map((empleado, index) => (
                  <CTableRow key={empleado.id_empleado}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{empleado.nombre}</CTableDataCell>
                    <CTableDataCell>{empleado.apellido}</CTableDataCell>
                    <CTableDataCell>{empleado.correo}</CTableDataCell>
                    <CTableDataCell>{empleado.documento}</CTableDataCell>
                    <CTableDataCell>{empleado.telefono}</CTableDataCell>
                    <CTableDataCell>{empleado.estado}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup aria-label="Basic mixed styles example">
                        <CButton
                          color="info"
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditar(empleado)}
                        >
                          Editar
                        </CButton>
                        <CButton 
                        color="warning" 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCambiarEstado(empleado.id_empleado)}
                        >
                          Cambiar Estado
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
          <CModalTitle>Editar Empleados</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={e => { 
            e.preventDefault()
            console.log(selectedEmpleadoId)
           }}>
            <div className="mb-3">
              <CFormLabel>Nombre</CFormLabel>
              <CFormInput type="text" value={selectedEmpleadoId?.nombre} onChange={e => {
                const newValue = {...selectedEmpleadoId}
                newValue.nombre = e.target.value
                setSelectedEmpleadoId(newValue)
              }}/>
            </div>
            <div className="mb-3">
              <CFormLabel>Apellido</CFormLabel>
              <CFormInput type="text" value={selectedEmpleadoId?.apellido} onChange={e => {
                const newValue = {...selectedEmpleadoId}
                newValue.apellido = e.target.value
                setSelectedEmpleadoId(newValue)
              }} />
            </div>
            <div className="mb-3">
              <CFormLabel>Correo</CFormLabel>
              <CFormInput type="email" value={selectedEmpleadoId?.correo} onChange={e => {
                const newValue = {...selectedEmpleadoId}
                newValue.correo = e.target.value
                setSelectedEmpleadoId(newValue)
              }}/>
            </div>
            <div className="mb-3">
              <CFormLabel>Documento</CFormLabel>
              <CFormInput type="number" value={selectedEmpleadoId?.documento} onChange={e => {
                const newValue = {...selectedEmpleadoId}
                newValue.documento = e.target.value
                setSelectedEmpleadoId(newValue)
              }}/>
            </div>
            <div className="mb-3">
              <CFormLabel>Telefono</CFormLabel>
              <CFormInput type="number" value={selectedEmpleadoId?.telefono} onChange={e => {
                const newValue = {...selectedEmpleadoId}
                newValue.telefono = e.target.value
                setSelectedEmpleadoId(newValue)
              }}/>
            </div>
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cerrar
          </CButton>
          <CButton color="primary" onClick={() => {
            EmpleadoService.updateEmpleado(selectedEmpleadoId.id_empleado, selectedEmpleadoId)
          }}>Guardar Cambios</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default ListaEmpleados
