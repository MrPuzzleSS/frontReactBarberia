/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormLabel,
  CFormSelect,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'

function CrearProducto() {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Crear Producto</strong>
          </CCardHeader>
          <CCardBody>
            <form>
              <div className="mb-3">
                <CFormLabel>Nombre </CFormLabel>
                <CFormInput type="text" />
              </div>

              <div className="mb-3">
                <CFormLabel>Descripcion</CFormLabel>
                <CFormInput />
              </div>
              <div className="mb-3">
                <CFormLabel>Precio</CFormLabel>
                <CFormInput type="num" />
              </div>
              <div className="mb-3">
                <CFormLabel> Stock</CFormLabel>
                <CFormInput type="num" />
              </div>
              <Link to="/Productos/lista-Productos">
                <CButton type="submit" color="primary" className="mr-2">
                  Guardar Producto
                </CButton>
              </Link>
              <CButton type="button" color="secondary">
                Cancelar
              </CButton>

            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CrearProducto