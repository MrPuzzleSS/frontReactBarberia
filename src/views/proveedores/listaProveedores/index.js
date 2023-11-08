/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
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

function ListaProveedores() {
  const [visible, setVisible] = useState(false);

  // Lista de proveedores (reemplaza esto con tus datos reales)
  const proveedores = [
    {
      id: 1,
      nombre: 'Proveedor 1',
      direccion: 'Dirección 1',
      telefono: '123-456-7890',
      email: 'proveedor1@example.com',
      tipo: 'Tipo 1',
    },
    {
      id: 2,
      nombre: 'Proveedor 2',
      direccion: 'Dirección 2',
      telefono: '987-654-3210',
      email: 'proveedor2@example.com',
      tipo: 'Tipo 2',
    },
    // Agrega más proveedores aquí
  ];

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
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Dirección</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Correo Electrónico</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Producto o Servicio</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {proveedores.map((proveedor, index) => (
                  <CTableRow key={proveedor.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{proveedor.nombre}</CTableDataCell>
                    <CTableDataCell>{proveedor.direccion}</CTableDataCell>
                    <CTableDataCell>{proveedor.telefono}</CTableDataCell>
                    <CTableDataCell>{proveedor.email}</CTableDataCell>
                    <CTableDataCell>{proveedor.tipo}</CTableDataCell>
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
                        <CButton color="danger" size="sm" variant="outline">
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
          <CModalTitle>Editar Proveedor</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form>
            <div className="mb-3">
              <CFormLabel>Nombre</CFormLabel>
              <CFormInput type="text" />
            </div>
            <div className="mb-3">
              <CFormLabel>Dirección</CFormLabel>
              <CFormInput type="text" />
            </div>
            <div className="mb-3">
              <CFormLabel>Teléfono</CFormLabel>
              <CFormInput type="tel" />
            </div>
            <div className="mb-3">
              <CFormLabel>Correo Electrónico</CFormLabel>
              <CFormInput type="email" />
            </div>
            <div className="mb-3">
              <CFormLabel>Tipo de Producto o Servicio</CFormLabel>
              <CFormInput type="text" />
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
  );
}

export default ListaProveedores;
