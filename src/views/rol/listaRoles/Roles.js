import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FaEdit, FaCheckCircle, FaTrash } from 'react-icons/fa';
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
  CFormLabel
} from '@coreui/react';

import { Link } from 'react-router-dom';

const ListaRol = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editRoleId, setEditRoleId] = useState(null);
  const [editRoleName, setEditRoleName] = useState('');
  const [editRolePermisos, setEditRolePermisos] = useState([]);
  const [allPermisos, setAllPermisos] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [errors, setErrors] = useState({});

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
    const originalStatus = item.estado;

    try {
      const confirmed = await Swal.fire({
        title: `¿Estás seguro de cambiar el estado del rol a ${newStatus}?`,
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cambiar estado'
      });

      if (confirmed.isConfirmed) {
        const response = await axios.put(`https://restapibarberia.onrender.com/rol/${item.id_rol}`, {
          estado: newStatus,
        });

        if (response.status === 200) {
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
        } else {
          throw new Error('Error al cambiar el estado del rol');
        }
      } else {
        // Si la operación es cancelada, revertir el estado del checkbox
        document.getElementById(`formSwitchCheckChecked_${item.id_rol}`).checked = item.estado === 'Activo';
      }
    } catch (error) {
      console.error('Error al cambiar el estado del rol:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error al cambiar el estado del rol',
        text: 'Ha ocurrido un error al intentar cambiar el estado del rol.',
      });

      // Si ocurre un error, revertir el estado del checkbox
      document.getElementById(`formSwitchCheckChecked_${item.id_rol}`).checked = item.estado === 'Activo';
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
    const validationErrors = {};

    if (!editRoleName) {
      validationErrors.nombre = 'Por favor, ingresa un nombre para el rol.';
    } else if (!/^[a-zA-Z]+$/.test(editRoleName)) {
      validationErrors.nombre = 'El nombre del rol no debe contener números ni caracteres especiales.';
    } else if (editRoleName.length < 3) {
      validationErrors.nombre = 'El nombre del rol debe tener al menos 3 caracteres.';
    } else if (editRoleName.length > 50) {
      validationErrors.nombre = 'El nombre del rol no puede exceder los 50 caracteres.';
    }

    if (editRolePermisos.length === 0) {
      validationErrors.permisos = 'Por favor, selecciona al menos un permiso.';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const editedRole = {
        nombre: editRoleName,
        permisos: editRolePermisos,
      };

      await axios.put(`https://restapibarberia.onrender.com/rol/${editRoleId}`, editedRole);

      setVisible(false);
      Swal.fire({
        icon: 'success',
        title: 'Rol actualizado con éxito',
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (item) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar este rol?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://restapibarberia.onrender.com/rol/${item.id_rol}`);

          const updatedRoles = roles.filter(role => role.id_rol !== item.id_rol);
          setRoles(updatedRoles);

          Swal.fire({
            icon: 'success',
            title: 'Rol eliminado exitosamente',
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          console.error('Error al eliminar el rol:', error);

          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar el rol',
            text: error.response?.data?.error || 'Error interno del servidor',
          });
        }
      }
    });
  };

  const filteredRoles = roles.filter((role) => {
    if (!role) return false;
    const nombreMatches = role.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return nombreMatches;
  });

  const indexOfLastUser = currentPage * pageSize;
  const indexOfFirstUser = indexOfLastUser - pageSize;
  const currentRoles = filteredRoles.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Lista de Roles</strong>
          <Link to="/CrearRol">
            <CButton color="primary">Agregar Rol</CButton>
          </Link>
        </CCardHeader>
        <CCardBody>
          <div className="mb-3" style={{ maxWidth: "200px" }}>
            <CFormInput
              type="text"
              placeholder="Buscar rol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control-sm"
            />
          </div>
          {loading ? (
            <p>Cargando roles...</p>
          ) : (
            <div className="table-responsive">
              <CTable align="middle" className="mb-0 border table-sm" hover responsive>
                <CTableHead color="light">
                  <tr>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Permisos</th>
                    <th></th>
                  </tr>
                </CTableHead>
                <CTableBody>
                  {currentRoles.map((item) => (
                    <tr key={item.id_rol}>
                      <td>{item.nombre}</td>
                      <td>
                        <strong>
                          <CBadge color={getColorForEstado(item.estado)}>{item.estado}</CBadge>
                        </strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {item.permisos.map((permiso, index) => (
                            <div key={permiso.id_permiso} className="d-flex align-items-center">
                              <FaCheckCircle style={{ color: 'green', marginRight: '5px' }} />
                              <span style={{ fontWeight: 'bold' }}>{permiso.nombre_permiso}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <CFormSwitch
                            size="xl"
                            label=""
                            id={`formSwitchCheckChecked_${item.id_rol}`}
                            checked={item.estado === 'Activo'}
                            onChange={() => handleSwitchChange(item)}
                          />
                          <CButton
                            color="secondary"
                            size="sm"
                            onClick={() => handleEditRole(item.id_rol)}
                            style={{ marginRight: '3px', backgroundColor: '#c0c0c0' }}
                          >
                            <FaEdit />
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => handleDelete(item)}
                            style={{ marginLeft: '5px' }}
                          >
                            <FaTrash />
                          </CButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </CTableBody>
              </CTable>
            </div>
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
            {Array.from({ length: Math.ceil(filteredRoles.length / pageSize) }, (_, i) => (
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
              disabled={currentPage === Math.ceil(filteredRoles.length / pageSize)}
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
          <CFormLabel><strong>Nombre del Rol</strong></CFormLabel>
          <CFormInput
            type="text"
            value={editRoleName}
            onChange={(e) => setEditRoleName(e.target.value)}
            disabled={editRoleName === 'Administrador' || editRoleName === 'Cliente' || editRoleName === 'Empleado'}
          />
          {errors.nombre && <div className="text-danger">{errors.nombre}</div>}

          <CFormLabel style={{ marginTop: '10px' }}><strong>Permisos</strong></CFormLabel>
          {allPermisos.map((permiso) => (
            <div key={permiso.id_permiso} style={{ marginBottom: '5px' }}>
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
              <label htmlFor={`editPermiso_${permiso.id_permiso}`} style={{ marginLeft: '5px', fontWeight: 'bold', color: editRolePermisos.includes(permiso.id_permiso) ? 'green' : 'initial' }}>
                {permiso.nombre_permiso.charAt(0).toUpperCase() + permiso.nombre_permiso.slice(1).toLowerCase()}
              </label>
            </div>
          ))}
          {errors.permisos && <div className="text-danger">{errors.permisos}</div>}
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
