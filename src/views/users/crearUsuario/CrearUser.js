import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import { CButton, CCard, CCardBody, CContainer, CForm, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react';

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
    axios.get('http://localhost:8095/api/rol')
      .then(response => {
        console.log('Roles obtenidos:', response.data.listaRoles);
        setRoles(response.data.listaRoles);
      })
      .catch(error => console.error('Error al obtener roles:', error));
  }, []);

  const handleAddUser = async () => {
    // Realizar validación de formulario aquí
    const validationErrors = {};

    // Validar ID del Usuario
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

    // Validar Contraseña
    if (!newUser.contrasena) {
      validationErrors.contrasena = 'Por favor, ingresa la contraseña.';
    } else {
      // Validar que la contraseña tenga al menos 8 caracteres
      if (newUser.contrasena.length < 8) {
        validationErrors.contrasena = 'La contraseña debe tener al menos 8 caracteres.';
      } else {
        // Validar que la contraseña contenga al menos un número
        if (!/\d/.test(newUser.contrasena)) {
          validationErrors.contrasena = 'La contraseña debe contener al menos un número.';
        }
        // Validar que la contraseña contenga al menos una letra mayúscula
        if (!/[A-Z]/.test(newUser.contrasena)) {
          validationErrors.contrasena = 'La contraseña debe contener al menos una letra mayúscula.';
        }
      }
    }

    // Validar Correo Electrónico
    if (!newUser.correo) {
      validationErrors.correo = 'Por favor, ingresa el correo electrónico.';
    } else {
      // Validar formato de correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newUser.correo)) {
        validationErrors.correo = 'Por favor, ingresa un formato válido de correo electrónico.';
      }
    }

    // Actualizar el estado con los errores
    setErrors(validationErrors);

    // Verificar si hay errores de validación
    if (Object.keys(validationErrors).length > 0) {
      // Si hay errores de validación, no continuar con la llamada a la API
      return;
    }

    try {
      const response = await axios.post('http://localhost:8095/api/usuario', newUser);
      console.log('Respuesta al agregar usuario:', response.data);

      // Mostrar SweetAlert de éxito
      Swal.fire({
        icon: 'success',
        title: 'Usuario agregado con éxito',
        showConfirmButton: false,
        timer: 1500, // Cerrar automáticamente después de 1.5 segundos
      });

      // Actualizar el estado para mostrar la redirección
      setSubmitted(true);
    } catch (error) {
      console.error('Error al agregar usuario:', error);

      // Mostrar SweetAlert de error
      Swal.fire({
        icon: 'error',
        title: 'Error al agregar usuario',
        text: 'Ha ocurrido un error al intentar agregar el usuario.',
      });
    }
  };

  const handleInputChange = (fieldName, value) => {
    // Actualizar el estado del campo con el nuevo valor
    setNewUser({ ...newUser, [fieldName]: value });

    // Validar el campo que ha cambiado
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
        } else if (!/^[a-zA-Z]+$/.test(value)) {
          validationErrors.nombre_usuario = 'El nombre de usuario no debe contener caracteres especiales ni números.';
        } else if (value.length < 3) {
          validationErrors.nombre_usuario = 'El nombre de usuario debe tener al menos 3 caracteres.';
        } else if (value.length > 20) {
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
            } else if (value.length > 254) {
              validationErrors.correo = 'El correo electrónico no debe exceder los 254 caracteres.';
            } else if (/[^\w@.-]/.test(value)) {
              validationErrors.correo = 'El correo electrónico no debe contener caracteres especiales ni espacios.';
            } else {
              delete validationErrors.correo;
            }
          }
          break;
        
        
        break;
      default:
        break;
    }

    // Actualizar el estado de los errores
    setErrors(validationErrors);
  };

  return (
    <div className="bg-light min-vh-80 d-flex align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCard className="mx-12">
            <CCardBody className="p-8">
              <CForm onSubmit={(e) => e.preventDefault()}>
                <h2 className="mb-8">CREAR USUARIO</h2>
                <div className="mb-3">
                  <CFormLabel>Rol del Usuario</CFormLabel>
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
                  <CFormLabel>Nombre de Usuario</CFormLabel>
                  <CFormInput
                    placeholder="Nombre de usuario"
                    autoComplete="username"
                    value={newUser.nombre_usuario}
                    onChange={(e) => handleInputChange('nombre_usuario', e.target.value)}
                  />
                  {errors.nombre_usuario && <div className="text-danger">{errors.nombre_usuario}</div>}
                </div>
                <div className="mb-3">
                  <CFormLabel>Contraseña</CFormLabel>
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
                  <CFormLabel>Correo Electrónico</CFormLabel>
                  <CFormInput
                    type="email"
                    placeholder="Correo electrónico"
                    autoComplete="email"
                    value={newUser.correo}
                    onChange={(e) => handleInputChange('correo', e.target.value)}
                  />
                  {errors.correo && <div className="text-danger">{errors.correo}</div>}
                </div>
                <div className="mb-3">
                  <CButton type="submit" onClick={handleAddUser}>
                    REGISTRAR USUARIO
                  </CButton>
                  <Link to="/listaUsuarios">
                    <CButton type="button" color="secondary">
                      Cancelar
                    </CButton>
                  </Link>
                </div>
              </CForm>
              {submitted && <Navigate to="/listaUsuarios" />}
            </CCardBody>
          </CCard>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
