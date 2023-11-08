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

function CrearProveedor() {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Crear Proveedor</strong>
          </CCardHeader>
          <CCardBody>
            <form>
              <div className="mb-3">
                <CFormLabel>Nombre del Proveedor</CFormLabel>
                <CFormInput type="text" />
              </div>
              <div className="mb-3">
                <CFormLabel>Dirección</CFormLabel>
                <CFormInput />
              </div>
              <div className="mb-3">
                <CFormLabel>Teléfono</CFormLabel>
                <CFormInput type="tel" />
              </div>
              <div className="mb-3">
                <CFormLabel>Correo Electrónico</CFormLabel>
                <CFormInput />
              </div>
              <div className="mb-3">
                <CFormLabel>Producto/Servicio</CFormLabel>
                <CFormInput />
              </div>
              <CButton type="submit" color="primary" className="mr-2">
                Guardar Compra
              </CButton>
              <Link to="/compras/lista-compras">
                <CButton type="button" color="secondary">
                  Cancelar
                </CButton>
              </Link>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CrearProveedor
