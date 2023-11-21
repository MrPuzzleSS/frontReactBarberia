import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser } from '@coreui/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const Register = () => {
  const [newUser, setNewUser] = useState({
    id_rol: '',
    nombre_usuario: '',
    contrasena: '',
    correo: '',
    estado: '',
  });

  const [roles, setRoles] = useState([]);

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
      const response = await axios.post('https://resapibarberia.onrender.com/api/usuario', newUser);
      console.log('Respuesta al agregar usuario:', response.data);

      toast.success('Usuario agregado con éxito');
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      toast.error('Error al agregar usuario');
    }
  };

  return (
    <div className="bg-light min-vh-80 d-flex align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={12} lg={20} xl={20}>
            <CCard className="mx-12">
              <CCardBody className="p-8">
                <CForm>
                  <h1 className="mb-8">CREAR USUARIO</h1>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <select
                      value={newUser.id_rol}
                      onChange={(e) => setNewUser({ ...newUser, id_rol: e.target.value })}
                    >
                      <option value="" disabled>Selecciona un rol</option>
                      {roles.map(role => (
                        <option key={role.id_rol} value={role.id_rol}>{role.nombre}</option>
                      ))}
                    </select>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Nombre de usuario"
                      autoComplete="username"
                      value={newUser.nombre_usuario}
                      onChange={(e) => setNewUser({ ...newUser, nombre_usuario: e.target.value })}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Contraseña"
                      autoComplete="new-password"
                      value={newUser.contrasena}
                      onChange={(e) => setNewUser({ ...newUser, contrasena: e.target.value })}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Correo electrónico"
                      autoComplete="email"
                      value={newUser.correo}
                      onChange={(e) => setNewUser({ ...newUser, correo: e.target.value })}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Estado"
                      autoComplete="estado"
                      value={newUser.estado}
                      onChange={(e) => setNewUser({ ...newUser, estado: e.target.value })}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                  <Link to="http://localhost:3000/ListaRol">
                    <CButton color="success" onClick={handleAddUser}>
                      REGISTRAR USUARIO
                    </CButton>
                  </Link>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <ToastContainer />
    </div>
  );
};

export default Register;
