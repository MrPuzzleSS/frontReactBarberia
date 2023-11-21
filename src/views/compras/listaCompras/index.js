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

function ListaCompras() {
  const [visible, setVisible] = useState(false)
  // Lista de compras (debes reemplazar esto con tus datos reales)
  const compras = [
    {
      id: 1,
      proveedor: 'Proveedor 1',
      producto: 'Producto 1',
      cantidad: 5,
      precioUnitario: 10,
      estado: 'Pendiente',
    },
    {
      id: 2,
      proveedor: 'Proveedor 2',
      producto: 'Producto 2',
      cantidad: 3,
      precioUnitario: 15,
      estado: 'Entregado',
    },
    // Agrega más compras aquí
  ]

  // Función para calcular el total de una compra
  const calcularTotalCompra = (compra) => {
    return compra.cantidad * compra.precioUnitario
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Lista de Compras</strong>
              <Link to="/compras/crear-compra">
              <CButton color="success">Agregar Compra</CButton>
              </Link>
            </div>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Proveedor</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Producto</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Cantidad</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Precio Unitario</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {compras.map((compra, index) => (
                  <CTableRow key={compra.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{compra.proveedor}</CTableDataCell>
                    <CTableDataCell>{compra.producto}</CTableDataCell>
                    <CTableDataCell>{compra.cantidad}</CTableDataCell>
                    <CTableDataCell>{compra.precioUnitario}</CTableDataCell>
                    <CTableDataCell>{calcularTotalCompra(compra)}</CTableDataCell>
                    <CTableDataCell>{compra.estado}</CTableDataCell>
                    <CTableDataCell>
                        <CButton
                          color="primary"
                          size="sm" className="me-2"
                          onClick={() => setVisible(!visible)}>
                          Editar
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm" className="me-2"
                          onClick={() => setVisible(!visible)}>
                          Eliminar
                        </CButton>
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
          <CModalTitle>Editar Compra</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form>
            <div className="mb-3">
              <CFormLabel>Proveedor</CFormLabel>
              <CFormSelect>
                <option value="">Seleccionar proveedor</option>
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Producto</CFormLabel>
              <CFormInput type="text" />
            </div>
            <div className="mb-3">
              <CFormLabel>Cantidad</CFormLabel>
              <CFormInput type="number" />
            </div>
            <div className="mb-3">
              <CFormLabel>Precio Unitario</CFormLabel>
              <CInputGroup className="mb-3">
                <CInputGroupText>$</CInputGroupText>
                <CFormInput type="number" />
              </CInputGroup>
            </div>
            <div className="mb-3">
              <CFormLabel>Estado</CFormLabel>
              <CFormSelect>
                <option value="">Seleccionar estado</option>
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Total</CFormLabel>
            </div>
            <div className="mb-3">
              <CFormLabel>Fecha de Compra</CFormLabel>
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

export default ListaCompras
