/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react'

function CrearProveedor() {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className='mb-4'>
          <CCardHeader>
            <strong>Crear Proveedor</strong>
          </CCardHeader>
          <CCardBody>
            <CForm className="row gy-4 gx-3 align-items-center">
              <CCol sm={6}>
                <CFormLabel>Nombre del Proveedor</CFormLabel>
                <CFormInput type="text" />
              </CCol>
                <CCol sm={6}>
                <CFormLabel>Dirección</CFormLabel>
                <CFormInput />
              </CCol>
                <CCol sm={6}>
                <CFormLabel>Teléfono</CFormLabel>
                <CFormInput type="tel" />
              </CCol>
              <CCol sm={6}>  
                <CFormLabel>Correo Electrónico</CFormLabel>
                <CFormInput />
              </CCol>
              <CCol sm={6}>
                <CFormLabel>Producto/Servicio</CFormLabel>
                <CFormInput />
              </CCol>
              <CCol xs={12}>
              <Link to="/proveedores/lista-proveedores">
              <CButton type="submit" color="primary">
                Crear Proveedor
              </CButton>
              </Link>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CrearProveedor
