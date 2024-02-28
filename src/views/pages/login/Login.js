import { jwtDecode as jwt_decode } from 'jwt-decode';
import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setSession, isAuthenticated } from '../../../components/auht'; // Ajusta la ruta de importación
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
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import logoBarberia from '../../../assets/images/logoBarberia2.png';
import fonds from '../../../assets/images/fonds.jpg';

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const handleLogin = async () => {
    try {
      setError(null);
  
      const response = await axios.post('http://localhost:8095/api/login', {
        nombre_usuario: nombreUsuario,
        contrasena,
      });
  
      const { token } = response.data;
  
      // Decodificar el token para obtener información del usuario
      const decodedToken = jwt_decode(token);
  
      // Almacenar la sesión y la información del usuario
      setSession(token, new Date(decodedToken.exp * 1000), response.data.usuario);
  
      // Verificar autenticación después de almacenar la sesión
      if (isAuthenticated()) {
        console.log('tu token ', token)
        // Redirigir después de almacenar la sesión
        navigate('/dashboard');
      } else {
        // Manejar caso en que la autenticación falla
        setError('La autenticación falló después de iniciar sesión');
      }
    } catch (error) {
      // Manejar errores al iniciar sesión
      if (error.response && error.response.status) {
        if (error.response.status === 401) {
          setError('La contraseña ingresada es incorrecta');
        } else if (error.response.status === 403) {
          const { mensaje } = error.response.data;
          setError(mensaje);
        } else {
          setError('Error al iniciar sesión');
        }
      } else {
        setError('Error al iniciar sesión');
      }
    }
  };
  
  
  
  
  
  return (
    <div
      className="min-vh-100 d-flex flex-row align-items-center"
      style={{
        backgroundImage: `url(${fonds})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <br />
                    <h3>Inicia sesión en tu cuenta</h3>
                    <br />
                    {error && <CAlert color="danger">{error}</CAlert>}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="USUARIO"
                        autoComplete="username"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="CONTRASEÑA"
                        autoComplete="current-password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow className="mt-3">
                      <CCol xs={12} className="text-center">
                        <CButton color="primary" className="px-4" onClick={handleLogin}>
                          INGRESAR
                        </CButton>
                      </CCol>
                    </CRow>
                    <CRow className="mt-3">
                      <CCol xs={12} className="text-center">
                        <CButton color="link" className="px-0" onClick={() => navigate('/resetPassword')}>
                          ¿Olvidó su contraseña?
                        </CButton>
                      </CCol>
                    </CRow>
                    <CRow className="mt-3">
                      <CCol xs={12} className="text-center">
                        <Link to="/register">
                          <CButton color="secondary">REGISTRARSE</CButton>
                        </Link>
                      </CCol>
                    </CRow>

                  </CForm>
                </CCardBody>
              </CCard>
              <CCard
                className="text-white"
                style={{ backgroundColor: '#4a4e69', paddingTop: '5rem', width: '44%' }}
              >
                <CCardBody className="text-center">
                  <img src={logoBarberia} alt="logo empresa" width="96%" />
                  <div>
                    ¡Bienvenido a Sion Barber Shop! Donde el estilo se encuentra con la elegancia.
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
