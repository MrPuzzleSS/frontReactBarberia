import React from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="bg-light min-vh-80 d-flex align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={12} lg={20} xl={20}> {/* Ajuste el tamaño de las columnas */}
            <CCard className="mx-12">
              <CCardBody className="p-8">
                <CForm>
                  <h1 className="mb-8">EDITAR ROL</h1>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="ROL" autoComplete="username" />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="ESTADO"
                      autoComplete="new-password"
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <Link to="/ListaRol">
                      <CButton color="success">EDITAR ROL</CButton>
                    </Link>
                  </div>

                </CForm>
              </CCardBody>
            </CCard>  
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;

