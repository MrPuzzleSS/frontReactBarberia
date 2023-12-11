import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser } from '@coreui/icons';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [newRole, setNewRole] = useState({
    nombre: '',
    estado: 'Activo',
    permisos: [],
  });

  const [permisos, setPermisos] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await axios.get('https://resapibarberia.onrender.com/api/permisos');
        console.log('Respuesta de la API de permisos:', response.data);
        setPermisos(response.data.listaPermisos || []);
        setForceUpdate((prev) => prev + 1); // Incrementar forceUpdate
      } catch (error) {
        console.error('Error al obtener la lista de permisos:', error);
      }
    };

    fetchPermisos();
  }, [forceUpdate]); // Agregar forceUpdate como dependencia

  const handlePermissionChange = (permisoId) => {
    setNewRole((prevRole) => {
      if (prevRole.permisos.includes(permisoId)) {
        return {
          ...prevRole,
          permisos: prevRole.permisos.filter((id) => id !== permisoId),
        };
      } else {
        return {
          ...prevRole,
          permisos: [...prevRole.permisos, permisoId],
        };
      }
    });
  };

  
  const handleAddRole = async () => {
    // Validation logic
    const validationErrors = {};

    if (!newRole.nombre) {
      validationErrors.nombre = 'Por favor, selecciona un rol.';
    }

    if (!newRole.estado) {
      validationErrors.estado = 'Por favor, selecciona el estado del rol.';
    }


    if (Object.keys(validationErrors).length > 0) {
      // Display SweetAlert for validation errors
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: 'Por favor, completa todos los campos correctamente.',
      });
      setErrors(validationErrors);
      return;
    }

    // If no validation errors, proceed with API call
    try {
      const response = await axios.post('https://resapibarberia.onrender.com/api/rol', newRole);
      console.log('Respuesta al agregar rol:', response.data);
      
      // Show SweetAlert for success
      Swal.fire({
        icon: 'success',
        title: 'Rol agregado con éxito',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error al agregar rol:', error);
      
      // Show SweetAlert for erro
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
                  <h1 className="mb-8">CREAR ROL</h1>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                    placeholder="Nombre de usuario"
                    autoComplete="rol"
                    value={newRole.nombre}
                    onChange={(e) => setNewRole({ ...newRole, nombre: e.target.value })}
                    
                  />
                  </CInputGroup>
                  {errors.nombre && <div className="text-danger">{errors.nombre}</div>}
                  <div>
                    <h4>Permisos:</h4>
                    {permisos.map((permiso) => (
                      <div key={permiso.id_permiso}>
                        <input
                          type="checkbox"
                          id={`permiso_${permiso.id_permiso}`}
                          checked={newRole.permisos.includes(permiso.id_permiso)}
                          onChange={() => handlePermissionChange(permiso.id_permiso)}
                        />
                        <label htmlFor={`permiso_${permiso.id_permiso}`}>{permiso.nombre_permiso}</label>
                      </div>
                    ))}
                    {errors.permisos && <div className="text-danger">{errors.permisos}</div>}
                  </div>

                  <div>
                    <CButton submit onClick={handleAddRole}>
                      REGISTRAR ROL
                    </CButton>
                    <Link to="/listaRol">
                      <CButton type="button" color="secondary">
                        Cancelar
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
