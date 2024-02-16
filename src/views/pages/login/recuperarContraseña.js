/*import React, { useState } from 'react';
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

      // Realizar la lógica para enviar un correo de restablecimiento de contraseña aquí
      // Puedes utilizar una API para manejar esta lógica en el back-end

      // Ejemplo de validación básica de dirección de correo electrónico
      if (!email || !email.trim()) {
        setError('Por favor, ingrese su dirección de correo electrónico.');
        return;
      }

      // Lógica adicional aquí (por ejemplo, enviar un correo electrónico al usuario con un enlace de restablecimiento)

      setSuccess('Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña.');
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
      zIndex: '1', // Ajusta según sea necesario
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
*/