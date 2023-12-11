import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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
import { cilLockLocked } from '@coreui/icons';
import prueba2 from '../../../assets/images/prueba2.jpg';
const MySwal = withReactContent(Swal);


const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { token } = useParams(); // Obtener el token de los parámetros de la URL

  const handleResetPassword = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (!password || !password.trim() || !confirmPassword || !confirmPassword.trim()) {
        setError('Por favor, complete todos los campos.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden. Por favor, inténtelo nuevamente.');
        return;
      }
      const response = await fetch('http://localhost:8095/api/recuperar-contrasena', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  mode: 'cors', // Puedes probar con 'no-cors' o 'same-origin'
  credentials: 'include', // Puedes probar con 'same-origin' o 'omit'
  body: JSON.stringify({ token, nuevaContrasena: password }),
});



      const responseBody = await response.json();

      if (response.ok) {
        setSuccess(responseBody.mensaje);

        MySwal.fire({
          icon: 'success',
          title: 'Éxito',
          text: responseBody.mensaje,
        }).then(() => {
          // Redirige al usuario a la página de inicio de sesión o a donde desees
          navigate('/login');
        });
      } else {
        setError(responseBody.mensaje);
      }
    } catch (error) {
  console.error('Error al procesar el restablecimiento de contraseña:', error);
  
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    setError('Hubo un problema de conexión. Por favor, revise su conexión a Internet e inténtelo nuevamente.');
  } else {
    setError('Hubo un problema al procesar su solicitud. Por favor, inténtelo nuevamente.');
  }
}
}



  return (
    <div
      className="min-vh-100 d-flex flex-row align-items-center"
      style={{
        backgroundImage: `url(${prueba2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
        zIndex: '1',
      }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xl={5} md={10}>
            <CCard className="p-4">
              <CCardBody>
                <CForm>
                  <h3 className="text-center mb-4">Restablecer Contraseña</h3>
                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && <div className="alert alert-success">{success}</div>}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Nueva Contraseña"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Confirmar Contraseña"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CButton color="primary" className="w-100" onClick={handleResetPassword}>
                    Restablecer Contraseña
                  </CButton>
                  <div className="text-center mt-3">
                    <CButton color="link" onClick={() => navigate('/login')}>
                      Volver al Inicio de Sesión
                    </CButton>
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

export default ResetPassword;

