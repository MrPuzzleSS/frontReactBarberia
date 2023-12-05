import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [newUser, setNewUser] = useState({
    id_rol: '',
    nombre_usuario: '',
    contrasena: '',
    correo: '',
    estado: '',
  });

  const [roles, setRoles] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    axios.get('https://resapibarberia.onrender.com/api/rol')
      .then(response => {
        console.log('Roles obtenidos:', response.data.listaRoles);
        setRoles(response.data.listaRoles);
      })
      .catch(error => console.error('Error al obtener roles:', error));
  }, []);

  const handleAddUser = async () => {
    try {
      // Validaciones
      if (!newUser.id_rol || !newUser.nombre_usuario || !newUser.contrasena || !newUser.correo || !newUser.estado) {
        toast.error('Por favor, completa todos los campos');
        return;
      }

      // Envío de la solicitud solo si las validaciones son exitosas
      const response = await axios.post('https://resapibarberia.onrender.com/api/usuario', newUser);
      console.log('Respuesta al agregar usuario:', response.data);

      toast.success('Usuario agregado con éxito');
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      toast.error('Error al agregar usuario');
    }
  };

  const handleInputChange = (fieldName, value) => {
    setNewUser({ ...newUser, [fieldName]: value });
  };

  // Verificar si todos los campos requeridos están llenos
  useEffect(() => {
    const areAllFieldsFilled = Object.values(newUser).every(value => value !== '');
    setIsButtonDisabled(!areAllFieldsFilled);
  }, [newUser]);

  return (
    <div className="bg-light min-vh-80 d-flex align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCard className="mx-12">
            <CCardBody className="p-8">
              <CForm>
                <h1 className="mb-8">CREAR USUARIO</h1>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cilUser" />
                  </CInputGroupText>
                  <select
                    value={newUser.id_rol}
                    onChange={(e) => handleInputChange('id_rol', e.target.value)}
                  >
                    <option value="" disabled>Selecciona un rol</option>
                    {roles.map(role => (
                      <option key={role.id_rol} value={role.id_rol}>{role.nombre}</option>
                    ))}
                  </select>
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cilUser" />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Nombre de usuario"
                    autoComplete="username"
                    value={newUser.nombre_usuario}
                    onChange={(e) => handleInputChange('nombre_usuario', e.target.value)}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cilUser" />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Contraseña"
                    autoComplete="new-password"
                    value={newUser.contrasena}
                    onChange={(e) => handleInputChange('contrasena', e.target.value)}
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cilUser" />
                  </CInputGroupText>
                  <CFormInput
                    type="email"
                    placeholder="Correo electrónico"
                    autoComplete="email"
                    value={newUser.correo}
                    onChange={(e) => handleInputChange('correo', e.target.value)}
                  />
                </CInputGroup>
                <CInputGroup className="mb-4">
                  <CInputGroupText>
                    <CIcon icon="cilUser" />
                  </CInputGroupText>
                  <select
                    value={newUser.estado}
                    onChange={(e) => handleInputChange('estado', e.target.value)}
                  >
                    <option value="" disabled>ESTADO</option>
                    <option value="activo">Activo</option>
                  </select>
                </CInputGroup>
                <div className="d-grid">
                  <CButton color="success" onClick={handleAddUser} disabled={isButtonDisabled}>
                    REGISTRAR USUARIO
                  </CButton>
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
