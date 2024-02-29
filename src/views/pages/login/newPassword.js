import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CButton, CCard, CCardBody, CForm, CFormInput, CAlert } from '@coreui/react';
import Swal from 'sweetalert2';
import fondo from '../../../assets/images/ftos/bb.jpg';
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get('token');

  useEffect(() => {
    // Log para verificar que el token se obtiene correctamente
    console.log('Token obtenido:', token);
  }, [token]);

  const handleResetPassword = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (!password.trim() || !confirmPassword.trim()) {
        setError('Por favor, complete todos los campos.');
        return;
      }

      console.log('Enviando solicitud con token:', token);

      const response = await fetch('https://restapibarberia.onrender.com/cambiar-contrasena', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({ token, nuevaContrasena: password }),
      });

      const responseBody = await response.json();

      if (response.ok) {
        setSuccess(responseBody.mensaje);

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: responseBody.mensaje,
        }).then(() => {
          navigate('/login');
        });
      } else {
        setError(responseBody.mensaje || 'Hubo un problema al procesar su solicitud. Por favor, inténtelo nuevamente.');
      }
    } catch (error) {
      console.error('Error al procesar el restablecimiento de contraseña:', error);

      if (error instanceof TypeError) {
        if (error.message.includes('Failed to fetch')) {
          setError('Hubo un problema de conexión. Por favor, revise su conexión a Internet e inténtelo nuevamente.');
        } else {
          setError('Hubo un problema al procesar su solicitud. Por favor, inténtelo nuevamente.');
        }
      } else {
        setError('Hubo un error inesperado. Por favor, inténtelo nuevamente.');
      }
    }
  };
  

  
  return (
    <div
      className="min-vh-100 d-flex flex-row align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <CCard className="p-4">
        <CCardBody>
          <CForm>
            <h3 className="text-center mb-4">Restablecer Contraseña</h3>
            {error && <CAlert color="danger">{error}</CAlert>}
            {success && <CAlert color="success">{success}</CAlert>}
            <CFormInput
              type="password"
              placeholder="Nueva Contraseña"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <CFormInput
              type="password"
              placeholder="Confirmar Contraseña"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <CButton color="primary" className="w-100 mt-3" onClick={handleResetPassword}>
              Restablecer Contraseña
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};


export default ResetPassword;
