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
import prueba2 from '../../../assets/images/ftos/bb.jpg';
import logoBarberia from '../../../assets/images/logoBarberia2.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [resetToken, setResetToken] = useState(null);  // Add state to store the reset token
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
      const response = await fetch('https://restapibarberia.onrender.com/solicitar-restablecimiento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Token obtenido:', data.resetToken); // Verifica si el token se obtiene correctamente
        setResetToken(data.resetToken);  // Store the reset token in the state

        setSuccess(data.mensaje);
        // Puedes redirigir al usuario a la página de cambio de contraseña o mostrar un mensaje adicional aquí.
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
                  <h3 className="text-center mb-4">Recuperar contraseña</h3>
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
                </CForm>
              </CCardBody>
              <CCardBody className="text-center">
                <img src={logoBarberia} alt="logo empresa" width="96%" />
                <div className="text-center mt-3">
                  <CButton color="link" onClick={() => navigate('/login')}>
                    Volver al Inicio de Sesión
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default ForgotPassword;
