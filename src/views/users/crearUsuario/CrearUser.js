import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import { CButton, CCard, CCardBody, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow, CFormLabel, CFormSelect } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get('https://resapibarberia.onrender.com/api/rol')
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
  
    // Validar Nombre de Usuario
    if (!newUser.nombre_usuario) {
      validationErrors.nombre_usuario = 'Por favor, ingresa el nombre de usuario.';
    } else if (newUser.nombre_usuario.length < 3) {
      validationErrors.nombre_usuario = 'El nombre de usuario debe tener al menos 3 caracteres.';
    } else {
      // Validar que el nombre no contenga números ni caracteres especiales
      const nameRegex = /^[A-Za-z]+$/;
    }
  
    // Validar Contraseña
    if (!newUser.contrasena) {
      validationErrors.contrasena = 'Por favor, ingresa la contraseña.';
    } else {
      // Validar que la contraseña tenga al menos 8 caracteres
      if (newUser.contrasena.length < 8) {
        validationErrors.contrasena = 'La contraseña debe tener al menos 8 caracteres.';
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
  
    // Validar Estado
    if (!newUser.estado) {
      validationErrors.estado = 'Por favor, selecciona el estado del usuario.';
    }
  
    // Actualizar el estado con los errores
    setErrors(validationErrors);
  
    // Verificar si hay errores de validación
    if (Object.keys(validationErrors).length > 0) {
      // Si hay errores de validación, no continuar con la llamada a la API
      return;
    }
  
    try {
      const response = await axios.post('https://resapibarberia.onrender.com/api/usuario', newUser);
      console.log('Respuesta al agregar usuario:', response.data);
  
      // Mostrar SweetAlert de éxito
      Swal.fire({
        icon: 'success',
        title: 'Usuario agregado con éxito',
        showConfirmButton: false,
        timer: 1500, // Cerrar automáticamente después de 1.5 segundos
      });
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
    setNewUser({ ...newUser, [fieldName]: value });

    // Limpiar errores cuando se cambia un valor
    setErrors({});
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
                </div>
                <div>
                  <CButton submit onClick={handleAddUser}>
                    REGISTRAR USUARIO
                  </CButton>
                  <Link to="/listaUsuarios">
                    <CButton type="button" color="secondary">
                      Cancelar
                    </CButton>
                  </Link>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CRow>
      </CContainer>
      <ToastContainer />
    </div>
  );
};

export default Register;
