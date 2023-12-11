import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CFormInput,
  CFormSwitch,
} from '@coreui/react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ListaRol = () => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedRole, setEditedRole] = useState({ nombre: '', estado: '' });
  const [searchId, setSearchId] = useState('');
  const [permisos, setPermisos] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedRolePermissions, setSelectedRolePermissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get('https://resapibarberia.onrender.com/api/rol');
        const permisosResponse = await axios.get('https://resapibarberia.onrender.com/api/permisos');

        setRoles(rolesResponse.data?.listaRoles || []);
        setPermisos(permisosResponse.data?.listaPermisos || []);

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://resapibarberia.onrender.com/api/rol/${searchId}`);
        setRoles(response.data ? [response.data] : []);
      } catch (error) {
        console.error('Error al obtener el rol por ID:', error);
      }
    };

    if (searchId !== '') {
      fetchData();
    }
  }, [searchId]);

  const handleAddRole = async (newRoleData) => {
    try {
      const response = await axios.post('https://resapibarberia.onrender.com/api/rol', newRoleData);
      setRoles([...roles, response.data]);
      toast.success('Rol agregado con éxito');
    } catch (error) {
      console.error('Error al agregar rol:', error);
      toast.error('Error al agregar rol');
    }
  };

  const handleEditRole = async (id, editedRoleData) => {
    try {
      const response = await axios.put(`https://resapibarberia.onrender.com/api/rol/${id}`, editedRoleData);
      setRoles(roles.map((role) => (role.id_rol === id ? response.data : role)));
      toast.success('Rol editado con éxito');
    } catch (error) {
      console.error('Error al editar rol:', error);
      toast.error('Error al editar rol');
    }
  };

  const handleSwitchChange = async (item) => {
    setSelectedRoleId(item.id_rol);
    const updatedRoles = roles.map((role) =>
      role.id_rol === item.id_rol ? { ...role, estado: role.estado === 'Activo' ? 'Inactivo' : 'Activo' } : role
    );
  
    setRoles(updatedRoles);
    setEditedRole({
      nombre: item.nombre,
      estado: item.estado === 'Activo' ? 'Inactivo' : 'Activo',
    });
  
    // Mostrar SweetAlert según el estado actualizado
    const alertText = item.estado === 'Activo' ? 'cambiado a Inactivo' : 'cambiado a Activo';
    const alertIcon = item.estado === 'Activo' ? 'error' : 'success';
  
    Swal.fire({
      icon: alertIcon,
      title: 'Estado Cambiado',
      text: `Rol ${alertText}`,
    });
  };
  
  
  const handleFetchPermissions = async (roleId) => {
    try {
      const response = await axios.get(`https://resapibarberia.onrender.com/api/rol/${roleId}`);
      const selectedRole = response.data;
  
      if (selectedRole && selectedRole.permisos) {
        setSelectedRolePermissions(selectedRole.permisos);
        setShowPermissionsModal(true);
      } else {
        handlePermissionsError(selectedRole);
      }
    } catch (error) {
      console.error('Error al obtener los permisos del rol:', error);
      handlePermissionsError();
    }
  };
  
  const handlePermissionsError = (details) => {
    console.error('El rol no tiene permisos o la respuesta no es válida:', details);
  };

  const handleSaveChanges = async () => {
    try {
      const { nombre, estado } = editedRole;

      if (selectedItem) {
        await handleEditRole(selectedItem.id_rol, { nombre, estado });
      } else {
        await handleAddRole({ nombre, estado });
      }

      setEditedRole({
        nombre: '',
        estado: '',
      });

      setVisible(false);
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      toast.error('Error al guardar cambios');
    }
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>LISTA DE ROLES</CCardHeader>
        <CCardBody>
          {/* Barra de búsqueda por ID */}
          <div className="mb-3">
            <CFormLabel>BUSCAR ROL POR ID</CFormLabel>
            <div className="d-flex">
              <CFormInput
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>
          </div>

          <Link to="/CrearRol">
            <CButton color="success" className="me-1">
              CREAR
            </CButton>
          </Link>
          {loading ? (
            <p>Cargando roles...</p>
          ) : (
            <CTable align="middle" className="mb-0 border" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>NOMBRE</CTableHeaderCell>
                  <CTableHeaderCell>ESTADO</CTableHeaderCell>
                  <CTableHeaderCell>ACCIONES</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {roles.map((item) => (
                  <CTableRow key={item.id_rol}>
                    <CTableDataCell>
                      <div>{item.id_rol}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.nombre}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <strong>{item.estado}</strong>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormSwitch
                        size="xl"
                        label=""
                        id={`formSwitchCheckChecked_${item.id_rol}`}
                        checked={item.estado === 'Activo'}
                        onChange={() => handleSwitchChange(item)}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      {/* Modal de Permisos */}
      <CModal
        show={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
      >
        <CModalHeader closeButton>
          <CModalTitle>Permisos del Rol</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h5>Permisos Asociados:</h5>
          <ul>
            {selectedRolePermissions.map((permiso) => (
              <li key={permiso.id_permiso}>{permiso.nombre_permiso}</li>
            ))}
          </ul>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowPermissionsModal(false)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>

      <ToastContainer />
    </>
  );
};

export default ListaRol;

      /* Modal de Edición 
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Editar ROL</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form>
            <div className="mb-3">
              <CFormLabel>Nombre del ROL</CFormLabel>
              <CFormInput
                type="text"
                value={editedRole.nombre}
                onChange={(e) => setEditedRole({ ...editedRole, nombre: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>ESTADO</CFormLabel>
            </div>
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cerrar
          </CButton>
          <CButton color="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </CButton>
        </CModalFooter>
      </CModal>
*/