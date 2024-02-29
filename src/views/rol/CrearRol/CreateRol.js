// En el componente Register
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
        const response = await axios.get('https://restapibarberia.onrender.com/api/permisos');
        console.log('Respuesta de la API de permisos:', response.data);
        setPermisos(response.data.listaPermisos || []);
      } catch (error) {
        console.error('Error al obtener la lista de permisos:', error);
      }
    };
  
    fetchPermisos();
  }, []);
  
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
    }
  
    if (!newRole.estado) {
      validationErrors.estado = 'Por favor, selecciona el estado del rol.';
    }
  
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8095/api/rol', newRole);
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
      toast.error('Error interno del servidor');
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
                      placeholder="Nombre del rol"
                      autoComplete="rol"
                      name="nombre"
                      value={newRole.nombre}
                      onChange={(e) =>
                        setNewRole({ ...newRole, [e.target.name]: e.target.value })
                      }
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
                        <label htmlFor={`permiso_${permiso.id_permiso}`}>
                          {permiso.nombre_permiso}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div>
                    <CButton type="button" onClick={handleAddRole}>
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

export default CreateRol;
