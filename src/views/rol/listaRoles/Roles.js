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
  const [searchId, setSearchId] = useState('');
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

    try {
      await axios.put(`https://restapibarberia.onrender.com/api/rol/${item.id_rol}`, {
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
    const validationErrors = {};

    // Validar el nombre del rol
    if (!editRoleName) {
      validationErrors.nombre = 'Por favor, ingresa un nombre para el rol.';
    } else if (!/^[a-zA-Z]+$/.test(editRoleName)) {
      validationErrors.nombre = 'El nombre del rol no debe contener números ni caracteres especiales.';
    } else if (editRoleName.length < 3) {
      validationErrors.nombre = 'El nombre del rol debe tener al menos 3 caracteres.';
    } else if (editRoleName.length > 50) {
      validationErrors.nombre = 'El nombre del rol no puede exceder los 50 caracteres.';
    }

    // Validar al menos un permiso seleccionado
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

      await axios.put(`https://restapibarberia.onrender.com/api/rol/${editRoleId}`, editedRole);

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
          // Realiza la solicitud de eliminación al backend utilizando el ID del ítem
          await axios.delete(`https://restapibarberia.onrender.com/api/rol/${item.id_rol}`);

          // Elimina el ítem de la lista actual de roles
          const updatedRoles = roles.filter(role => role.id_rol !== item.id_rol);
          setRoles(updatedRoles);

          // Muestra una alerta de éxito
          Swal.fire({
            icon: 'success',
            title: 'Rol eliminado exitosamente',
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          console.error('Error al eliminar el rol:', error);

          // Muestra una alerta de error
          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar el rol',
            text: error.response?.data?.error || 'Error interno del servidor',
          });
        }
      }
    });
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
            <div className="table-responsive">
              <CTable align="middle" className="mb-0 border table-sm" hover responsive>
                <CTableHead color="light">
                  <tr>

                    <th>NOMBRE</th>
                    <th>ESTADO</th>
                    <th>PERMISOS</th>
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
     // Ajusta el margen izquierdo del checkbox
  />
  <CButton
    color="secondary"
    size="sm"
    onClick={() => handleEditRole(item.id_rol)}
    style={{ marginRight: '3px', backgroundColor: '#c0c0c0' }} // Ajusta el margen derecho del botón de editar
  >
    <FaEdit /> {/* Icono de editar */}
  </CButton>
  <CButton
    color="danger"
    size="sm"
    onClick={() => handleDelete(item)}
    style={{ marginLeft: '5px' }} // Ajusta el margen izquierdo del botón de eliminar
  >
    <FaTrash  />
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
