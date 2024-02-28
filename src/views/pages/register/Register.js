import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow } from '@coreui/react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { Link } from 'react-router-dom';
import logoBarberia from '../../../assets/images/logoBarberia2.png';
import prueba2 from '../../../assets/images/ftos/mk.png';

const RegisterCliente = () => {
  const roleIdCliente = 1;

  const [newUser, setNewUser] = useState({
    id_rol: roleIdCliente,
    nombre_usuario: '',
    contrasena: '',
    correo: '',
    estado: 'Activo',
  });

  const [errors, setErrors] = useState({});

  const handleAddUser = async () => {
    // Realizar validación de formulario aquí
    // ...

    try {
      const response = await axios.post('http://localhost:8095/api/usuario', newUser);
      console.log('Respuesta al agregar usuario:', response.data);

      // Mostrar SweetAlert de éxito
      Swal.fire({
        icon: 'success',
        title: 'Usuario registrado con éxito',
        showConfirmButton: false,
        timer: 1500, // Cerrar automáticamente después de 1.5 segundos
      });
    } catch (error) {
      console.error('Error al registrar usuario:', error);

      // Mostrar SweetAlert de error
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar usuario',
        text: 'Ha ocurrido un error al intentar registrar el usuario.',
      });
    }
  };

  const handleInputChange = (fieldName, value) => {
    setNewUser({ ...newUser, [fieldName]: value });

    // Limpiar errores cuando se cambia un valor
    setErrors({});
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ backgroundImage: `url(${prueba2})`, backgroundSize: 'cover' }}>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10} lg={8} xl={6}>
            <CCard className="text-white" style={{ backgroundColor: '#4a4e69', paddingTop: '5rem' }}>
              <CCardBody className="text-center">
                <img src={logoBarberia} alt="logo empresa" width="60%" />
              </CCardBody>
              <CCardBody className="p-8">
                <CForm>
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
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Correo electrónico"
                      autoComplete="email"
                      value={newUser.correo}
                      onChange={(e) => handleInputChange('correo', e.target.value)}
                    />
                  </CInputGroup>
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
                  <CButton color="primary" onClick={handleAddUser}>
                    REGISTRAR
                  </CButton>
                  <Link to="/login">
                    <CButton color="secondary" className="ms-2">
                      REGRESAR
                    </CButton>
                  </Link>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default RegisterCliente;
