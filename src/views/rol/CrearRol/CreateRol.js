import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser } from '@coreui/icons';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../pages/login/UserInforPage.css'; // Importa tu archivo de estilos CSS personalizados

const CreateRol = () => {
  const navigate = useNavigate();

  const [newRole, setNewRole] = useState({
    nombre: '',
    estado: 'Activo',
    permisos: [], // Array para almacenar los permisos seleccionados
  });

  const [permisos, setPermisos] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await axios.get('http://localhost:8095/api/permisos');
        console.log('Respuesta de la API de permisos:', response.data);
        const capitalizedPermisos = capitalizePermissions(response.data.listaPermisos || []);
        setPermisos(capitalizedPermisos);
      } catch (error) {
        console.error('Error al obtener la lista de permisos:', error);
      }
    };

    fetchPermisos();
  }, []);

  const capitalizePermissions = (permissions) => {
    return permissions.map(permission => {
      return {
        ...permission,
        nombre_permiso: permission.nombre_permiso.charAt(0).toUpperCase() + permission.nombre_permiso.slice(1)
      };
    });
  };

  const handlePermissionChange = (permisoId) => {
    setNewRole((prevRole) => ({
      ...prevRole,
      permisos: prevRole.permisos.includes(permisoId)
        ? prevRole.permisos.filter((id) => id !== permisoId)
        : [...prevRole.permisos, permisoId],
    }));
  };

  const handleAddRole = async () => {
    const validationErrors = {};
  
    if (!newRole.nombre) {
      validationErrors.nombre = 'Por favor, ingresa un nombre para el rol.';
    } else if (newRole.nombre.length < 3) {
      validationErrors.nombre = 'El nombre del rol debe tener al menos 3 caracteres.';
    } else if (newRole.nombre.length > 50) {
      validationErrors.nombre = 'El nombre del rol no puede exceder los 50 caracteres.';
    }
  
    if (newRole.permisos.length === 0) {
      validationErrors.permisos = 'Por favor, selecciona al menos un permiso.';
    }
  
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
  
    try {
      const response = await axios.post('https://restapibarberia.onrender.com/api/rol', newRole);
      console.log('Respuesta al agregar rol:', response.data);
  
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Rol agregado con éxito',
          showConfirmButton: false,
          timer: 1500,
        });
  
        setTimeout(() => {
          navigate('/listaRol');
        }, 1500);
      } else {
        toast.error('Error al agregar rol');
      }
    } catch (error) {
      console.error('Error al agregar rol:', error);
  
      if (error.response && error.response.status === 400 && error.response.data.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar rol',
          text: error.response.data.error,
        });
      } else {
        toast.error('Error interno del servidor');
      }
    }
  };
  


  const handleInputChange = (fieldName, value) => {
    const validationErrors = { ...errors };

    switch (fieldName) {
      case 'nombre':
        setNewRole({ ...newRole, nombre: value });

        if (!value) {
          validationErrors.nombre = 'Por favor, ingresa un nombre para el rol.';
        } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
          validationErrors.nombre = 'El nombre del rol no debe contener números ni caracteres especiales.';
        } else if (value.length < 3) {
          validationErrors.nombre = 'El nombre del rol debe tener al menos 3 caracteres.';
        } else if (value.length > 50) {
          validationErrors.nombre = 'El nombre del rol no puede exceder los 50 caracteres.';
        } else {
          delete validationErrors.nombre;
        }
        break;
      default:
        break;
    }

    setErrors(validationErrors);
  };


  return (
    <div className="bg-light min-vh-80 d-flex align-items-center">
      <CContainer>
        <CRow className="justify-content-center"> 
          <CCol md={12} lg={6} xl={6}>
          <CCard className="mx-4" style={{ marginTop: '30px', marginBottom: '20px' }}>
              <CCardBody className="p-4">
                <CForm>
                  <h1 className="mb-4 text-center">CREAR ROL</h1>
                  <CInputGroup className="mb-3">
                    <CInputGroupText className="input-group-text-icon">
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      className="input-nombre"
                      placeholder="Nombre del rol"
                      autoComplete="rol"
                      name="nombre"
                      value={newRole.nombre}
                      onChange={(e) =>
                        handleInputChange('nombre', e.target.value)
                      }
                    />
                  </CInputGroup>





                  {errors.nombre && <div className="text-danger">{errors.nombre}</div>}
                  <div className="mt-3">
                    <h4>Permisos:</h4>
                    {permisos.map((permiso) => (
                      <div key={permiso.id_permiso} className="mb-2 d-flex align-items-center">
                        <input
                          type="checkbox"
                          id={`permiso_${permiso.id_permiso}`}
                          className="custom-checkbox mr-2"
                          checked={newRole.permisos.includes(permiso.id_permiso)}
                          onChange={() => handlePermissionChange(permiso.id_permiso)}
                        />
                        <label
                          htmlFor={`permiso_${permiso.id_permiso}`}
                          className={`font-weight-bold ${newRole.permisos.includes(permiso.id_permiso) ? 'text-success' : 'text-black'}`}
                          style={{ marginLeft: '5px', fontWeight: 'bold' }}
                        >
                          {permiso.nombre_permiso}
                        </label>
                      </div>
                    ))}
                    {errors.permisos && <div className="text-danger">{errors.permisos}</div>}
                  </div>
                  <div className="mt-4 d-flex justify-content-center">
                    <CButton type="button" onClick={handleAddRole} color="primary" className="mx-2">
                      REGISTRAR ROL
                    </CButton>
                    <Link to="/listaRol">
                      <CButton type="button" color="secondary" className="mx-2">
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

export default CreateRol;
