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
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState(null);

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

  const handleEditar = (id) => {
    // Abrir el modal y almacenar el ID del empleado seleccionado
    setSelectedEmpleadoId(id);
    setVisible(true);
  };

  const handleCambiarEstado = async (empleadoId) => {
    try {
      // Cambiar el estado del empleado y actualizar la lista
      await EmpleadoService.cambiarEstadoEmpleado(empleadoId);
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
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">nombre</CTableHeaderCell>
                  <CTableHeaderCell scope="col">apellido</CTableHeaderCell>
                  <CTableHeaderCell scope="col">correo</CTableHeaderCell>
                  <CTableHeaderCell scope="col">documento</CTableHeaderCell>
                  <CTableHeaderCell scope="col">telefono</CTableHeaderCell>
                  <CTableHeaderCell scope="col">estado</CTableHeaderCell>
                  <CTableHeaderCell scope="col">acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {empleados.map((empleado, index) => (
                  <CTableRow key={empleado.id}>
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
                          onClick={() => handleEditar(empleado.id)}
                        >
                          Editar
                        </CButton>
                        <CButton 
                        color="warning" 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCambiarEstado(empleado.id)}
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
          <form>
            <div className="mb-3">
              <CFormLabel>Nombre</CFormLabel>
              <CFormInput type="text" />
            </div>
            <div className="mb-3">
              <CFormLabel>Apellido</CFormLabel>
              <CFormInput type="text" />
            </div>
            <div className="mb-3">
              <CFormLabel>Correo</CFormLabel>
              <CFormInput type="email" />
            </div>
            <div className="mb-3">
              <CFormLabel>Documento</CFormLabel>
              <CFormInput type="number" />
            </div>
            <div className="mb-3">
              <CFormLabel>telefono</CFormLabel>
              <CFormInput type="number" />
            </div>
            <div className="mb-3">
              <CFormLabel>Estado</CFormLabel>
              <CFormSelect>
                <option value="">Selecciona el estado</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </CFormSelect>
            </div>
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cerrar
          </CButton>
          <CButton color="primary">Guardar Cambios</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default ListaEmpleados
