/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
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

function ListaProductos() {
  const [visible, setVisible] = useState(false)

  const productos = [
    {
      id: 1,
      nombre: 'gorra',
      descricion: 'nike',
      precio: 30000,
      stock: 20
      
    },
    {
      id: 2,
      nombre: 'Camiseta',
      descricion: 'Adidas',
      precio: 40000,
      stock: 20
    },
    {
        id: 3,
        nombre: 'Busos',
        descricion: 'Adidas',
        precio: 80000,
        stock: 20
      },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Lista de Productos</strong>
              <Link to="/productos/crear-producto">
                <CButton color="primary">Agregar Producto</CButton>
              </Link>
            </div>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">nombre</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Descripcion</CTableHeaderCell>
                  <CTableHeaderCell scope="col">precio</CTableHeaderCell>
                  <CTableHeaderCell scope="col">stock</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {productos.map((producto, index) => (
                  <CTableRow key={producto.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{producto.nombre}</CTableDataCell>
                    <CTableDataCell>{producto.descricion}</CTableDataCell>
                    <CTableDataCell>{producto.precio}</CTableDataCell>
                    <CTableDataCell>{producto.stock}</CTableDataCell>
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
          <CModalTitle>Editar Producto</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form>
            <div className="mb-3">
              <CFormLabel>Nombre</CFormLabel>
              <CFormInput type="text" />
            </div>
            <div className="mb-3">
              <CFormLabel>descricion</CFormLabel>
              <CFormInput type="text" />
            </div>
            <div className="mb-3">
              <CFormLabel>precio</CFormLabel>
              <CFormInput type="tel" />
            </div>
            <div className="mb-3">
              <CFormLabel>stock</CFormLabel>
              <CFormInput type="email" />
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

export default ListaProductos