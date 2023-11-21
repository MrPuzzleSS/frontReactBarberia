import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import logoBarberia from '../../../assets/images/logoBarberia2.png'


const Login = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center" >
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4" >
                <CCardBody>
                  <CForm>
                    <h1>SION-BARBER</h1>
                    <p className="text-medium-emphasis">Iniciar sesión en tu cuenta</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="USUARIO" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="CONTRASEÑA"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <Link to="/#/dashborad">
                          <CButton color="primary" className="px-4">
                            INGRESAR
                          </CButton>
                        </Link>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Olvidó su contraseña?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white" style={{ backgroundColor: '#669bbc', paddingTop: '5rem', width: '44%' }}>
                <CCardBody className="text-center">
                  <img src={logoBarberia} alt="logo empresa" width="76%" />
                  <div>
                    ¡Bienvenido a Sion Barber Shop! Donde el estilo se encuentra con la elegancia.
                  </div>
                  <Link to="/register">
                    <CButton color="primary" className="mt-3" active tabIndex={-2}>
                      REGISTRAR
                    </CButton>
                  </Link>
                </CCardBody>
              </CCard>


            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login


