import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilEnvelopeOpen } from '@coreui/icons';
import prueba2 from '../../../assets/images/prueba2.jpg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (!email || !email.trim()) {
        setError('Por favor, ingrese su dirección de correo electrónico.');
        return;
      }

      // Lógica para enviar la solicitud al backend
      const response = await fetch('http://localhost:8095/api/solicitar-restablecimiento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token; // Captura el token desde la respuesta

        setSuccess(data.mensaje);

        // Redirige al usuario a la página de éxito con el token después de 2 segundos
        setTimeout(() => {
          navigate(`/resetContrasena/`);
        }, 2000);
      } else {
        setError(data.mensaje);
      }
    } catch (error) {
      console.error('Error al procesar la recuperación de contraseña:', error);
      setError('Hubo un problema al procesar su solicitud. Por favor, inténtelo nuevamente.');
    }
  };

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
                  <h3 className="text-center mb-4">Recuperar Contraseña</h3>
                  {error && <CAlert color="danger">{error}</CAlert>}
                  {success && <CAlert color="success">{success}</CAlert>}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilEnvelopeOpen} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Correo Electrónico"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </CInputGroup>
                  <CButton color="primary" className="w-100" onClick={handleResetPassword}>
                    Enviar Instrucciones
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

export default ForgotPassword;
