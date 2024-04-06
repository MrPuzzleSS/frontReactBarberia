import { jwtDecode as jwt_decode } from 'jwt-decode';
import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setSession, isAuthenticated } from '../../../components/auht';
import {
  CButton,
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
import fonds from '../../../assets/images/ftos/bb.jpg';
const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validateUsername = (username) => {
    if (!username.trim()) {
      throw new Error('El campo de usuario no puede estar vacío');
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      throw new Error('El nombre de usuario solo puede contener letras y números');
    }

    if (username.length < 3 || username.length > 20) {
      throw new Error('El nombre de usuario debe tener entre 4 y 20 caracteres');
    }
  };

  const validatePassword = (password) => {
    if (!password.trim()) {
      throw new Error('El campo de contraseña no puede estar vacío');
    }

    if (password.length < 6 || password.length > 20) {
      throw new Error('La contraseña debe tener entre 6 y 20 caracteres');
    }

    if (!/^[a-zA-Z0-9]+$/.test(password)) {
      throw new Error('La contraseña solo puede contener letras y números');
    }
  };
  
  const handleLogin = async () => {
    try {
      setError(null);
      
      const response = await axios.post('http://localhost:8095/api/login', {
        nombre_usuario: nombreUsuario,
        contrasena,
      });
  
      const { token } = response.data;
  
      const decodedToken = jwt_decode(token);
  
      setSession(token, new Date(decodedToken.exp * 1000), response.data.usuario);
  
      if (isAuthenticated()) {
        navigate('/dashboard');
      } else {
        setError('La autenticación falló después de iniciar sesión');
      }
    } catch (error) {
      if (error.message === 'El campo de usuario no puede estar vacío' || error.message === 'El nombre de usuario solo puede contener letras y números' || error.message === 'El nombre de usuario debe tener entre 4 y 20 caracteres') {
        setError('Error en el campo de usuario: ' + error.message);
      } else if (error.message === 'El campo de contraseña no puede estar vacío' || error.message === 'La contraseña debe tener entre 6 y 20 caracteres' || error.message === 'La contraseña solo puede contener letras y números') {
        setError('Error en el campo de contraseña: ' + error.message);
      } else if (error.response && error.response.status) {
        if (error.response.status === 401) {
          setError('Usuario o Contraseña Incorrectos');
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
    <div className="min-vh-100 d-flex flex-column">
      <div className="d-flex" style={{ flex: 1 }}>
        <div style={{ backgroundImage: `url(${fonds})`, backgroundSize: 'cover', backgroundPosition: 'center', flex: 2 }} />
        <CContainer style={{ flex: 1, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CRow className="justify-content-center">
            <CCol md={10}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <img src={logoBarberia} alt="logo empresa" width="70%" style={{ marginBottom: '20px' }} />
                <CForm style={{ width: '80%', margin: '0 auto' }}>
                  <h2>Iniciar sesión</h2>
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
                      <CButton
                        color="primary"
                        className="px-4"
                        style={{ fontSize: '1.2rem', borderRadius: '5px' }}
                        onClick={handleLogin}
                      >
                        INGRESAR
                      </CButton>
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol xs={12} className="text-center">
                      <CButton
                        color="link"
                        className="px-0"
                        style={{ color: '#333', fontSize: '0.9rem' }}
                        onClick={() => navigate('/resetPassword')}
                      >
                        ¿Olvidó su contraseña?
                      </CButton>
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol xs={12} className="text-center">
                      <Link to="/register">
                        <CButton color="success">NUEVA CUENTA</CButton>
                      </Link>
                    </CCol>
                  </CRow>
                </CForm>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </div>
  );
};

export default Login;
