import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FaEdit, FaTrash, } from 'react-icons/fa'; 
import { CBadge } from '@coreui/react';
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
  CFormInput,
  CFormSwitch,
  CPagination,
  CPaginationItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel // Asegúrate de tener esta importación
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get('http://localhost:8095/api/rol');
        setRoles(rolesResponse.data?.listaRoles || []);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setLoading(false);
      }
    };

    fetchData();

    const fetchAllPermisos = async () => {
      try {
        const permisosResponse = await axios.get('http://localhost:8095/api/permisos');
        setAllPermisos(permisosResponse.data?.listaPermisos || []);
      } catch (error) {
        console.error('Error al obtener permisos:', error);
      }
    };

    fetchAllPermisos();
  }, []);

  const getColorForEstado = (estado) => {
    if (estado === 'Activo') {
      return 'success';
    } else if (estado === 'Inactivo') {
      return 'danger';
    } else {
      return 'default';
    }
  };

  const handleSwitchChange = async (item) => {
    const newStatus = item.estado === 'Activo' ? 'Inactivo' : 'Activo';

    try {
      await axios.put(`http://localhost:8095/api/rol/${item.id_rol}`, {
        ...item,
        estado: newStatus,
      });

      const updatedRoles = roles.map((role) =>
        role.id_rol === item.id_rol ? { ...role, estado: newStatus } : role
      );

      setRoles(updatedRoles);

      Swal.fire({
        icon: 'success',
        title: `El estado del rol se ha cambiado a ${newStatus}`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error al cambiar el estado del rol:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error al cambiar el estado del rol',
        text: 'Ha ocurrido un error al intentar cambiar el estado del rol.',
      });
    }
  };

  const handleEditRole = async (roleId) => {
    const roleToEdit = roles.find((role) => role.id_rol === roleId);
    setEditRoleId(roleId);
    setEditRoleName(roleToEdit.nombre);
    setEditRolePermisos(roleToEdit.permisos.map((permiso) => permiso.id_permiso));
    setVisible(true);

  };

  const handleSaveEdit = async () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas guardar los cambios realizados?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar cambios',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const editedRole = {
            nombre: editRoleName,
            permisos: editRolePermisos,
          };
    
          await axios.put(`http://localhost:8095/api/rol/${editRoleId}`, editedRole);
    
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
      }
    });
  };
  
  
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastUser = currentPage * pageSize;
  const indexOfFirstUser = indexOfLastUser - pageSize;
  const currentRoles = roles.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>LISTA DE ROLES</strong>
          <Link to="/CrearRol">
            <CButton color="primary">AGREGAR ROL</CButton>
          </Link>
        </CCardHeader>
        <CCardBody>
          <div className="mb-3" style={{ maxWidth: "200px" }}>
            <CFormInput
              type="text"
              placeholder="Buscar rol por ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="form-control-sm"
            />
          </div>
  
          {loading ? (
            <p>Cargando roles...</p>
          ) : (

            <CTable align="middle" className="mb-0 border table-sm" hover responsive>
  <CTableHead color="light">
    <CTableRow>
      <CTableHeaderCell>ID</CTableHeaderCell>
      <CTableHeaderCell>NOMBRE</CTableHeaderCell>
      <CTableHeaderCell>ESTADO</CTableHeaderCell>
      <CTableHeaderCell>PERMISOS</CTableHeaderCell>
      <CTableHeaderCell>ACCIONES</CTableHeaderCell>
    </CTableRow>
  </CTableHead>
  <CTableBody>
    {currentRoles.map((item) => (
      <CTableRow key={item.id_rol}>
        <CTableDataCell>{item.id_rol}</CTableDataCell>
        <CTableDataCell>{item.nombre}</CTableDataCell>
        <CTableDataCell>
          <strong>
            <CBadge color={getColorForEstado(item.estado)}>
              {item.estado}
            </CBadge>
          </strong>
        </CTableDataCell>
        <CTableDataCell>
          {item.permisos.map((permiso) => (
            <div key={permiso.id_permiso} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'lightgreen', marginRight: '5px' }}></div>
              <div>{permiso.nombre_permiso}</div>
            </div>
          ))}
        </CTableDataCell>
        <CTableDataCell className="d-flex">
        <CFormSwitch
            size="xl"
            label=""
            id={`formSwitchCheckChecked_${item.id_rol}`}
            checked={item.estado === 'Activo'}
            onChange={() => handleSwitchChange(item)}
          />
        <CButton
  color="primary"
  size="sm"
  onClick={() => handleEditRole(item.id_rol)}
  style={{
    marginLeft: '5px',
    backgroundColor: 'orange',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '3px 10px'
  }}
>
  <FaEdit style={{ color: 'black' }} />
</CButton>
      
          
        </CTableDataCell>
      </CTableRow>
    ))}
  </CTableBody>
</CTable>

          )}
          <CPagination
            align="center"
            aria-label="Page navigation example"
            className="mt-3"
          >
            <CPaginationItem
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </CPaginationItem>
            {Array.from({ length: Math.ceil(roles.length / pageSize) }, (_, i) => (
              <CPaginationItem
                key={i}
                onClick={() => handlePageChange(i + 1)}
                active={i + 1 === currentPage}
              >
                {i + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(roles.length / pageSize)}
            >
              Siguiente
            </CPaginationItem>
          </CPagination>
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
