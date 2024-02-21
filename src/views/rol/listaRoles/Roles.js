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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const ListaRol = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [editRoleId, setEditRoleId] = useState(null);
  const [editRoleName, setEditRoleName] = useState('');
  const [editRolePermisos, setEditRolePermisos] = useState([]);
  const [allPermisos, setAllPermisos] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get('https://restapibarberia.onrender.com/api/rol');
        setRoles(rolesResponse.data?.listaRoles || []);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setLoading(false);
      }
    };

    fetchData();

    // Fetch all permissions for later use
    const fetchAllPermisos = async () => {
      try {
        const permisosResponse = await axios.get('https://restapibarberia.onrender.com/api/permisos');
        setAllPermisos(permisosResponse.data?.listaPermisos || []);
      } catch (error) {
        console.error('Error al obtener permisos:', error);
      }
    };

    fetchAllPermisos();
  }, []);

  const handleSwitchChange = async (item) => {
    const updatedRoles = roles.map((role) =>
      role.id_rol === item.id_rol ? { ...role, estado: role.estado === 'Activo' ? 'Inactivo' : 'Activo' } : role
    );
  
    setRoles(updatedRoles);

     var alertText = item.estado === 'Activo' ? 'cambiado a Inactivo' : 'cambiado a Activo';
     var alertIcon = item.estado === 'Activo' ? 'error' : 'success';

    Swal.fire({
      icon: alertIcon,
      title: 'Estado Cambiado',
      text: `Rol ${alertText}`,
    });
  
    // Mostrar SweetAlert según el estado actualizado
    var alertText = item.estado === 'Activo' ? 'cambiado a Inactivo' : 'cambiado a Activo';
    var alertIcon = item.estado === 'Activo' ? 'error' : 'success';
  
    Swal.fire({
      icon: alertIcon,
      title: 'Estado Cambiado',
      text: `Rol ${alertText}`,
    });
  };

  const handleEditRole = async (roleId) => {
    const roleToEdit = roles.find((role) => role.id_rol === roleId);
    setEditRoleId(roleId);
    setEditRoleName(roleToEdit.nombre);
    setEditRolePermisos(roleToEdit.permisos.map((permiso) => permiso.id_permiso));
    setVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      const editedRole = {
        nombre: editRoleName,
        permisos: editRolePermisos,
      };

      await axios.put(`https://restapibarberia.onrender.com/api/rol/${editRoleId}`, editedRole);

      setVisible(false);
      Swal.fire({
        icon: 'success',
        title: 'Rol actualizado con éxito',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar el rol',
        text: error.response?.data?.error || 'Error interno del servidor',
      });
    }
  };
  
  const handlePermissionsError = (details) => {
    console.error('El rol no tiene permisos o la respuesta no es válida:', details);
    // Puedes mostrar una alerta, notificación o manejar el error según tus necesidades
  };


  const handleAssignPermiso = async (permisoId) => {
    try {
      const response = await axios.post(`https://restapibarberia.onrender.com/api/${editRoleId}/permiso`, { id_permiso: permisoId });
      console.log(response.data); // Manejar la respuesta según sea necesario
      // Actualizar el estado o realizar cualquier acción adicional
    } catch (error) {
      console.error('Error al asignar permiso:', error);
      // Manejar el error según sea necesario
    }
  };
  
  const handleRemovePermiso = async (permisoId) => {
    try {
      const response = await axios.delete(`https://restapibarberia.onrender.com/api/${editRoleId}/permisos/${permisoId}`);
      console.log(response.data); // Manejar la respuesta según sea necesario
      // Actualizar el estado o realizar cualquier acción adicional
    } catch (error) {
      console.error('Error al quitar permiso:', error);
      // Manejar el error según sea necesario
    }
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>LISTA DE ROLES</CCardHeader>
        <CCardBody>
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
                  <CTableHeaderCell>PERMISOS</CTableHeaderCell>
                  <CTableHeaderCell>CAMBIAR ESTADO</CTableHeaderCell>
                  <CTableHeaderCell>EDITAR ROL</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {roles.map((item) => (
                  <CTableRow key={item.id_rol}>
                    <CTableDataCell>{item.id_rol}</CTableDataCell>
                    <CTableDataCell>{item.nombre}</CTableDataCell>
                    <CTableDataCell>
                      <strong>{item.estado}</strong>
                    </CTableDataCell>
                  
                    <CTableDataCell>
                      {item.permisos.map((permiso) => (
                        <div key={permiso.id_permiso} style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'lightgreen', marginRight: '5px' }}></div>
                          <div>{permiso.nombre_permiso}</div>
                        </div>
                      ))}
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
                    <CTableDataCell>
                      <CButton color="primary" size="sm" onClick={() => handleEditRole(item.id_rol)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Editar Rol</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>Nombre del Rol</CFormLabel>
          <CFormInput
            type="text"
            value={editRoleName}
            onChange={(e) => setEditRoleName(e.target.value)}
          />
          <CFormLabel>Permisos</CFormLabel>
          {allPermisos.map((permiso) => (
            <div key={permiso.id_permiso}>
              <input
                type="checkbox"
                id={`editPermiso_${permiso.id_permiso}`}
                checked={editRolePermisos.includes(permiso.id_permiso)}
                onChange={() => {
                  setEditRolePermisos((prevPermisos) =>
                    prevPermisos.includes(permiso.id_permiso)
                      ? prevPermisos.filter((id) => id !== permiso.id_permiso)
                      : [...prevPermisos, permiso.id_permiso]
                  );
                }}
              />
              <label htmlFor={`editPermiso_${permiso.id_permiso}`}>
                {permiso.nombre_permiso}
              </label>
            </div>
          ))}
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSaveEdit}>
            Guardar
          </CButton>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancelar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default ListaRol;
