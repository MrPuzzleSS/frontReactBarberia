import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CButton, CCard, CCardBody, CContainer, CForm, CFormInput, CFormLabel, CFormSelect, CRow, CCol } from '@coreui/react';
import { Link, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.js';

const Register = () => {
  const [newUser, setNewUser] = useState({
    id_rol: '',
    nombre_usuario: '',
    contrasena: '',
    correo: '',
    estado: 'Activo',
  });

  const [roles, setRoles] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get('https://restapibarberia.onrender.com/api/rol')
      .then(response => {
        console.log('Roles obtenidos:', response.data.listaRoles);
        setRoles(response.data.listaRoles);
      })
      .catch(error => console.error('Error al obtener roles:', error));
  }, []);

  
  const handleAddUser = async () => {
    const validationErrors = {};

    if (!newUser.id_rol) {
      validationErrors.id_rol = 'Por favor, selecciona un rol para el usuario.';
    }

    if (!newUser.nombre_usuario) {
      validationErrors.nombre_usuario = 'Por favor, ingresa el nombre de usuario.';
    } else if (!/^[a-zA-Z]+$/.test(newUser.nombre_usuario)) {
      validationErrors.nombre_usuario = 'El nombre de usuario no debe contener caracteres especiales ni números.';
    } else if (newUser.nombre_usuario.length < 3) {
      validationErrors.nombre_usuario = 'El nombre de usuario debe tener al menos 3 caracteres.';
    } else if (newUser.nombre_usuario.length > 20) {
      validationErrors.nombre_usuario = 'El nombre de usuario no debe tener más de 20 caracteres.';
    } else if (/\s/.test(newUser.nombre_usuario)) {
      validationErrors.nombre_usuario = 'El nombre de usuario no debe contener espacios en blanco.';
    }

    if (!newUser.contrasena) {
      validationErrors.contrasena = 'Por favor, ingresa la contraseña.';
    } else {
      if (newUser.contrasena.length < 8) {
        validationErrors.contrasena = 'La contraseña debe tener al menos 8 caracteres.';
      } else {
        if (!/\d/.test(newUser.contrasena)) {
          validationErrors.contrasena = 'La contraseña debe contener al menos un número.';
        }
        if (!/[A-Z]/.test(newUser.contrasena)) {
          validationErrors.contrasena = 'La contraseña debe contener al menos una letra mayúscula.';
        }
      }
    }

    if (!newUser.correo) {
      validationErrors.correo = 'Por favor, ingresa el correo electrónico.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newUser.correo)) {
        validationErrors.correo = 'Por favor, ingresa un formato válido de correo electrónico.';
      }
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    try {
      const response = await axios.post('https://restapibarberia.onrender.com/api/usuario', newUser);
      console.log('Respuesta al agregar usuario:', response.data);
    
      Swal.fire({
        icon: 'success',
        title: 'Usuario agregado con éxito',
        showConfirmButton: false,
        timer: 1500,
      });
    
      setSubmitted(true);
    } catch (error) {
      console.error('Error al agregar usuario:', error);
    
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
  }

  

  const handleInputChange = (fieldName, value) => {
    setNewUser({ ...newUser, [fieldName]: value });

    const validationErrors = { ...errors };

    switch (fieldName) {
      case 'id_rol':
        if (!value) {
          validationErrors.id_rol = 'Por favor, selecciona un rol para el usuario.';
        } else {
          delete validationErrors.id_rol;
        }
        break;
      case 'nombre_usuario':
        if (!value) {
          validationErrors.nombre_usuario = 'Por favor, ingresa el nombre de usuario.';
        } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
          validationErrors.nombre_usuario = 'El nombre de usuario no debe contener caracteres especiales ni números.';
        } else if (value.length < 3) {
          validationErrors.nombre_usuario = 'El nombre de usuario debe tener al menos 3 caracteres.';
        } else if (value.length > 30) {
          validationErrors.nombre_usuario = 'El nombre de usuario no debe tener más de 20 caracteres.';
        } else if (/\s/.test(value)) {
          validationErrors.nombre_usuario = 'El nombre de usuario no debe contener espacios en blanco.';
        } else {
          delete validationErrors.nombre_usuario;
        }
        break;
      case 'contrasena':
        if (!value) {
          validationErrors.contrasena = 'Por favor, ingresa la contraseña.';
        } else if (value.length < 8) {
          validationErrors.contrasena = 'La contraseña debe tener al menos 8 caracteres.';
        } else if (!/\d/.test(value)) {
          validationErrors.contrasena = 'La contraseña debe contener al menos un número.';
        } else if (!/[A-Z]/.test(value)) {
          validationErrors.contrasena = 'La contraseña debe contener al menos una letra mayúscula.';
        } else {
          delete validationErrors.contrasena;
        }
        break;
      case 'correo':
        if (!value) {
          validationErrors.correo = 'Por favor, ingresa el correo electrónico.';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            validationErrors.correo = 'Por favor, ingresa un formato válido de correo electrónico.';
          } else if (value.length > 50) {
            validationErrors.correo = 'El correo electrónico no debe exceder los 50 caracteres.';
          } else if (/[^\w@.-]/.test(value)) {
            validationErrors.correo = 'El correo electrónico no debe contener caracteres especiales ni espacios.';
          } else {
            delete validationErrors.correo;
          }
        }
        break;
      default:
        break;
    }

    setErrors(validationErrors);
  };
  
  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={12} lg={7} xl={8} className="mt-n5">
            <CCard className="mx-auto" style={{ marginTop: '-300px', marginBottom: '20px' }}>

              <CCardBody className="p-12">
              <CForm onSubmit={(e) => e.preventDefault()}>
  <h2 className="mb-6 text-center">Registrar Usuario</h2>
  <div className="mb-3">
    <CFormLabel><strong>Rol del Usuario</strong></CFormLabel>
    <CFormSelect
      value={newUser.id_rol}
      onChange={(e) => handleInputChange('id_rol', e.target.value)}
    >
      <option value="" disabled>Selecciona un rol</option>
      {roles.map(role => (
        <option key={role.id_rol} value={role.id_rol}>{role.nombre}</option>
      ))}
    </CFormSelect>
    {errors.id_rol && <div className="text-danger">{errors.id_rol}</div>}
  </div>
  <div className="mb-3">
    <CFormLabel><strong>Nombre de Usuario</strong></CFormLabel>
    <CFormInput
      placeholder="Nombre de usuario"
      autoComplete="username"
      value={newUser.nombre_usuario}
      onChange={(e) => handleInputChange('nombre_usuario', e.target.value)}
    />
    {errors.nombre_usuario && <div className="text-danger">{errors.nombre_usuario}</div>}
  </div>
  <div className="mb-3">
    <CFormLabel><strong>Contraseña</strong></CFormLabel>
    <CFormInput
      type="password"
      placeholder="Contraseña"
      autoComplete="new-password"
      value={newUser.contrasena}
      onChange={(e) => handleInputChange('contrasena', e.target.value)}
    />
    {errors.contrasena && <div className="text-danger">{errors.contrasena}</div>}
  </div>
  <div className="mb-3">
    <CFormLabel><strong>Correo Electrónico</strong></CFormLabel>
    <CFormInput
      type="email"
      placeholder="Correo electrónico"
      autoComplete="email"
      value={newUser.correo}
      onChange={(e) => handleInputChange('correo', e.target.value)}
    />
    {errors.correo && <div className="text-danger">{errors.correo}</div>}
  </div>
  <div className="mb-3 d-flex justify-content-center">
    <CButton type="submit" onClick={handleAddUser}>
      Registrar Usuario
    </CButton>
    <Link to="/listaUsuarios">
      <CButton type="button" color="secondary" className="ms-3">
        Cancelar
      </CButton>
    </Link>
  </div>
</CForm>

                {submitted && <Navigate to="/listaUsuarios" />}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
