import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { CButton, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow, CAlert } from '@coreui/react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { Link, Navigate } from 'react-router-dom';
import logoBarberia from '../../../assets/images/logoBarberia2.png';
import prueba2 from '../../../assets/images/fonds.jpg';

const RegisterCliente = () => {
  const roleIdCliente = 11;

  const [newUser, setNewUser] = useState({
    id_rol: roleIdCliente,
    nombre_usuario: '',
    contrasena: '',
    correo: '',
    estado: 'Activo',
  });

  const [errors, setErrors] = useState({
    nombre_usuario: '',
    correo: '',
    contrasena: '',
  });

  const [redirect, setRedirect] = useState(false);
 

  const handleAddUser = async () => {
    try {
      setErrors({}); // Limpiar errores al intentar registrar
  
      const response = await axios.post('http://localhost:8095/api/usuario', newUser);
      console.log('Respuesta al agregar usuario:', response.data);
  
      Swal.fire({
        icon: 'success',
        title: 'Usuario registrado con éxito',
        showConfirmButton: false,
        timer: 1500,
      });
  
      setRedirect(true); // Redirigir al usuario después de registrar
    } catch (error) {
      console.error('Error al registrar usuario:', error);
  
      if (error.response.status === 400 && error.response.data && error.response.data.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar usuario',
          text: error.response.data.error,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar usuario',
          text: 'Ha ocurrido un error al intentar agregar el usuario.',
        });
      }
    }
};


const handleInputChange = (fieldName, value) => {
  // Validar espacios en blanco al inicio o al final del valor
  if (value.trim() !== value) {
    setErrors({ ...errors, [fieldName]: 'El valor no puede contener espacios en blanco al inicio o al final.' });
    return;
  }

  // Limpiar errores si no hay espacios en blanco
  setErrors({ ...errors, [fieldName]: '' });

  // Validar el campo antes de actualizar el estado
  validateField(fieldName, value);

  // Actualizar el estado del nuevo usuario
  setNewUser({ ...newUser, [fieldName]: value });
};

const validateField = (fieldName, value) => {
  let error = '';
  if (fieldName === 'nombre_usuario') {
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,30}$/.test(value)) {
      error = 'El nombre de usuario debe tener entre 3 y 30 caracteres y solo letras';
    }
  } else if (fieldName === 'correo') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'El correo electrónico ingresado no es válido';
    }
  } else if (fieldName === 'contrasena') {
    if (!/(?=.*[A-Z])(?=.*[0-9]).{6,}/.test(value)) {
      error = 'La contraseña debe tener al menos 6 caracteres, una mayúscula y un número';
    }
  }

  // Actualizar el estado de los errores
  setErrors({ ...errors, [fieldName]: error });
};

const isFormValid = () => {
  // Verificar si todos los errores son una cadena vacía
  return Object.values(errors).every((error) => error === '');
};


  return (
    <div className="min-vh-100 d-flex align-items-center">
      <div className="w-100" style={{ backgroundImage: `url(${prueba2})`, backgroundSize: 'cover', height: '100vh' }} />
      <div className="w-50 d-flex justify-content-center align-items-center flex-column">
        <CContainer>
          <CRow className="justify-content-center">
            <div className="text-center">
              <img src={logoBarberia} alt="logo empresa" style={{ width: '60%', marginBottom: '2rem' }} />
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Registrarse</p>
            </div>
          </CRow>
          <CRow className="justify-content-center">
            <CForm style={{ width: '80%' }}>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  placeholder="Nombre de usuario"
                  autoComplete="username"
                  value={newUser.nombre_usuario}
                  onChange={(e) => handleInputChange('nombre_usuario', e.target.value)}
                />
              </CInputGroup>
              {errors.nombre_usuario && <CAlert color="danger">{errors.nombre_usuario}</CAlert>}
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>
                <CFormInput
                  type="email"
                  placeholder="Correo electrónico"
                  autoComplete="email"
                  value={newUser.correo}
                  onChange={(e) => handleInputChange('correo', e.target.value)}
                />
              </CInputGroup>
              {errors.correo && <CAlert color="danger">{errors.correo}</CAlert>}
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>
                <CFormInput
                  type="password"
                  placeholder="Contraseña"
                  autoComplete="new-password"
                  value={newUser.contrasena}
                  onChange={(e) => handleInputChange('contrasena', e.target.value)}
                />
              </CInputGroup>
              {errors.contrasena && <CAlert color="danger">{errors.contrasena}</CAlert>}
              <CInputGroup className="mb-4">
                <CInputGroupText>
                  <CIcon icon={cilLockLocked} />
                </CInputGroupText>
                <CFormInput
                  type="password"
                  placeholder="Confirmar contraseña"
                  autoComplete="new-password"
                />
              </CInputGroup>
              <CButton color="primary" disabled={!isFormValid()} onClick={handleAddUser}>
                REGISTRAR
              </CButton>
              {redirect && <Navigate to="/login" />}
              <Link to="/login">
                <CButton color="secondary" className="ms-2">
                  REGRESAR
                </CButton>
              </Link>
            </CForm>
          </CRow>
        </CContainer>
      </div>
    </div>
  );
};

export default RegisterCliente;
