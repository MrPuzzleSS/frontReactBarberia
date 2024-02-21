import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserInfo } from '../../../components/auht';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
} from '@coreui/react';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faUnlockAlt,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import fondo from '../../../assets/images/ftos/bk.jpg';
import './UserInforPage.css';


const UserInformationPage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userInfo = await getUserInfo();
      setUserData(userInfo);
    };

    fetchUserData();
  }, []);

  return (
    <div
  
    >
      
      <CContainer className="text-center">
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCard className="mb-3 user-info-card">
              <CCardHeader className="bg-dark text-white">
                <h3 className="h4">Información del Usuario</h3>
              </CCardHeader>

              <CCardBody>
                {userData ? (
                  <div>
                    <CInputGroup className="mb-3">
                      <CInputGroupText style={{ marginRight: '10px' }}>
                        <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
                        NOMBRE
                      </CInputGroupText>
                      <CFormInput type="text" value={userData.nombre_usuario} readOnly />
                    </CInputGroup>




                    <CInputGroup className="mb-3">
                      <CInputGroupText style={{ marginRight: '10px' }}>
                        <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '10px' }}  />
                        CORREO
                      </CInputGroupText>
                      <CFormInput type="text" value={userData.correo} readOnly />
                    </CInputGroup>

                    <CInputGroup className="mb-3">
                      <CInputGroupText style={{ marginRight: '10px' } } >
                        <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
                        ROL
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        value={userData.rol ? userData.rol.nombre : 'Sin Rol'}
                        readOnly
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-3">
                      <CInputGroupText style={{ marginRight: '10px' }}>
                        <FontAwesomeIcon icon={faCheck} style={{ marginRight: '10px' }} />
                        ESTADO
                      </CInputGroupText>
                      <CFormInput type="text" value={userData.estado} readOnly />
                    </CInputGroup>



                    <div className="permissions-container mb-3">
                      <CInputGroupText style={{ marginRight: '10px' }}>
                        <FontAwesomeIcon icon={faUnlockAlt} style={{ marginRight: '10px' }}  />
                        PERMISOS

                      </CInputGroupText>

              
                      <div className="permissions-list">
                        {userData.rol && userData.rol.permisos ? (
                          userData.rol.permisos.map((permiso) => (
                            <div key={permiso.id_permiso} className="permission-item">
                              <FontAwesomeIcon icon={faCheck} className="check-icon" />
                              <span className="permission-text">{permiso.nombre_permiso}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-black">El usuario no tiene permisos asignados.</p>
                        )}
                      </div>
                    </div>

       
                    <Link to="/dashboard">
                      <button className="btn btn-secondary">REGRESAR</button>
                    </Link>
                  </div>
                ) : (
                  <p>Cargando...</p>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );

  
};

export default UserInformationPage;
