/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
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
} from '@coreui/react'

function ListaEmpleados() {
  const [visible, setVisible] = useState(false)
  // Lista de compras (debes reemplazar esto con tus datos reales)
  const empleados = [
    {
      id: 1,
      nombre: 'Valeria',
      apellido: 'Carmona',
      correo: 'Vale@gmail.com',
      documento: 1019228982,
      telefono: 3009878976,
      estado: 'Activo',
    },
    {
      id: 2,
      nombre: 'Sara',
      apellido: 'Valencia',
      correo: 'sara@gmail.com',
      documento: 1019228982,
      telefono: 3009878976,
      estado: 'Activo',
    },
  ]

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
                          onClick={() => setVisible(!visible)}
                        >
                          Editar
                        </CButton>
                        <CButton color="warning" size="sm" variant="outline">
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
