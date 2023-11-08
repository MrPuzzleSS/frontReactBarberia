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

function ListaVentas() {
  const [visible, setVisible] = useState(false)
  // Lista de compras (debes reemplazar esto con tus datos reales)
  const ventas = [
    {
      id: 1,
      cliente: 'Valeria Carmona',
      empleado: 'Feliciano Mosquera',
      nmrfactu: '01',
      valorTotal: '190.000',
      estado: 'Pendiente'
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Lista de Ventas</strong>
              <Link to="se pone el link.....">
              <CButton color="primary">Agregar Ventas</CButton>
              </Link>
            </div>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Cliente</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Empleado</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nro° Factura</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Valor Total</CTableHeaderCell>
                  <CTableHeaderCell scope="col">estado</CTableHeaderCell>
                  <CTableHeaderCell scope="col">acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {ventas.map((venta, index) => (
                  <CTableRow key={venta.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{venta.cliente}</CTableDataCell>
                    <CTableDataCell>{venta.empleado}</CTableDataCell>
                    <CTableDataCell>{venta.nmrfactu}</CTableDataCell>
                    <CTableDataCell>{venta.valorTotal}</CTableDataCell>
                    <CTableDataCell>{venta.estado}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup aria-label="Basic mixed styles example">
                        <CButton
                          color="info"
                          size="sm"
                          variant="outline"
                          onClick={() => setVisible(!visible)}
                        >
                          Detalle 
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
          <CModalTitle>Detalle de Ventas</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form>
            <div className="mb-3">
              <CFormLabel>IdProducto: 4</CFormLabel>
            </div>
            <div className="mb-3">
              <CFormLabel>Cantidad: 3</CFormLabel>
            </div>
            <div className="mb-3">
              <CFormLabel>Valor Venta: 70.000</CFormLabel>
            </div>
            <div className="mb-3">
              <CFormLabel>Valor Total: 210.000</CFormLabel>
            </div>
            <div className="mb-3">
              <CFormLabel>Tipo de Venta: Productos</CFormLabel>
            </div>
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default ListaVentas
