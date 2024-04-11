import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { CBadge } from '@coreui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { getUserInfo } from '../../../components/auht';
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
  CPagination,
  CPaginationItem
} from '@coreui/react';
import { Link } from 'react-router-dom';

const ListaUsuarios = () => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get('https://restapibarberia.onrender.com/api/rol');
        const usuariosResponse = await axios.get('https://restapibarberia.onrender.com/api/usuario');
        setUsers(usuariosResponse.data.usuarios || []);
        setRoles(rolesResponse.data.listaRoles);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchData();
  }, []);

  const getRolNombre = (id_rol) => {
    const rol = roles.find((r) => r.id_rol === id_rol);
    return rol ? rol.nombre : 'Rol Desconocido';
  };

  const handleDelete = async (item) => {
    const loggedUser = getUserInfo();

    if (loggedUser && item.id_usuario === loggedUser.id_usuario) {
      Swal.fire({
        icon: 'error',
        title: 'No puedes eliminar tu propia cuenta',
        text: 'Por favor, contacta al administrador si necesitas ayuda.'
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://restapibarberia.onrender.com/api/usuario/${item.id_usuario}`);
          setUsers((prevUsers) => prevUsers.filter((user) => user.id_usuario !== item.id_usuario));

          Swal.fire({
            icon: 'success',
            title: 'Usuario eliminado con éxito',
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          console.error('Error al eliminar usuario:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar usuario',
            text: 'Ha ocurrido un error al intentar eliminar el usuario.',
          });
        } finally {
          setSelectedItem(null);
        }
      }
    });
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setVisible(true);
  };

  const getColorForEstado = (estado) => {
    if (estado === 'Activo') {
      return 'success';
    } else if (estado === 'Inactivo') {
      return 'danger';
    } else {
      return 'default';
    }
  };
  const handleSwitchChange = (item) => {
    const newStatus = item.estado === 'Activo' ? 'Inactivo' : 'Activo';
    const originalStatus = item.estado;
  
    // Mantener una copia del estado original del usuario
    const originalUser = { ...item };
  
    Swal.fire({
      title: `¿Estás seguro de cambiar el estado del usuario a ${newStatus}?`,
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar estado'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`https://restapibarberia.onrender.com/api/usuario/${item.id_usuario}`, {
            ...item,
            estado: newStatus,
          });
  
          const updatedUsers = users.map((user) =>
            user.id_usuario === item.id_usuario ? { ...user, estado: newStatus } : user
          );
  
          setUsers(updatedUsers);
  
          Swal.fire({
            icon: 'success',
            title: `El estado del usuario se ha cambiado a ${newStatus}`,
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          console.error('Error al cambiar el estado del usuario:', error);
  
          Swal.fire({
            icon: 'error',
            title: 'Error al cambiar el estado del usuario',
            text: 'Ha ocurrido un error al intentar cambiar el estado del usuario.',
          });
  
          // Si ocurre un error, revertir el estado al original
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id_usuario === originalUser.id_usuario ? originalUser : user))
          );
        }
      } else {
        // Si la operación es cancelada, revertir el estado al original
        document.getElementById(`formSwitchCheckChecked_${item.id_usuario}`).checked = item.estado === 'Activo';
      }
    });
  };
  

  

  const handleSaveChanges = async () => {
    const nombreUsuario = document.getElementById('nombreUsuario').value.trim();
    const correoElectronico = document.getElementById('correoElectronico').value.trim();
    const validationErrors = {};
  
    // Validar nombre de usuario
    if (!nombreUsuario) {
      validationErrors.nombre_usuario = 'Por favor, ingresa un nombre de usuario.';
    } else if (nombreUsuario.length < 3) {
      validationErrors.nombre_usuario = 'El nombre de usuario debe tener al menos 3 caracteres.';
      
    }else if (nombreUsuario.length > 30) {
      validationErrors.nombre_usuario = 'El nombre de usuario no puede contener mas de 30 caracteres.';
      
    }
     else if (/\s/.test(nombreUsuario)) {
      validationErrors.nombre_usuario = 'El nombre de usuario no puede contener espacios en blanco.';
    }
  
    // Validar correo electrónico
    if (!correoElectronico) {
      validationErrors.correo = 'Por favor, ingresa un correo electrónico.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoElectronico)) {
      validationErrors.correo = 'El correo electrónico ingresado no es válido.';
    }
  
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
  
    try {
      const confirmSave = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas guardar los cambios realizados?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar cambios',
        cancelButtonText: 'Cancelar',
      });

      if (confirmSave.isConfirmed) {
        const editedUser = {
          ...selectedItem,
          nombre_usuario: document.getElementById('nombreUsuario').value,
          correo: document.getElementById('correoElectronico').value,
        };

        await axios.put(`https://restapibarberia.onrender.com/api/usuario/${editedUser.id_usuario}`, editedUser);

        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id_usuario === selectedItem.id_usuario ? editedUser : user))
        );
  
        Swal.fire({
          icon: 'success',
          title: 'Usuario editado con éxito',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Error al editar usuario:', error);
  
      let errorMessage = 'Ha ocurrido un error al intentar editar el usuario.';
  
      if (error.response && error.response.status === 400 && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
  
      Swal.fire({
        icon: 'error',
        title: 'Error al editar usuario',
        text: errorMessage,
      });
    } finally {
      setVisible(false);
    }
  };
  

  


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastUser = currentPage * pageSize;
  const indexOfFirstUser = indexOfLastUser - pageSize;

  const currentUsers = users.filter(user =>
    user.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getRolNombre(user.id_rol).toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(indexOfFirstUser, indexOfLastUser);
  

  return (
    <>
      <br />
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Lista de usuarios</strong>
          <Link to="/CrearUsuarios">
            <CButton color="primary" className="me-1">
              Agregar Usuario
            </CButton>
          </Link>
        </CCardHeader>
        <CCardBody>
          <div className="mb-3" style={{ maxWidth: "200px" }}>
            <CFormInput
              type="text"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control-sm"
            />
          </div>

          <CTable align="middle" className="mb-0 border table-sm" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Correo</CTableHeaderCell>
                <CTableHeaderCell>Rol</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentUsers.map((item) => (
                <CTableRow key={item.id_usuario}>
                  <CTableDataCell>{item.nombre_usuario}</CTableDataCell>
                  <CTableDataCell>{item.correo}</CTableDataCell>
                  <CTableDataCell>{getRolNombre(item.id_rol)}</CTableDataCell>
                  <CTableDataCell>
                    <strong>
                      <CBadge color={getColorForEstado(item.estado)}>
                        {item.estado}
                      </CBadge>
                    </strong>
                  </CTableDataCell>
                  <CTableDataCell className="d-flex">
                    <CFormSwitch
                      size="xl"
                      label=""
                      id={`formSwitchCheckChecked_${item.id_usuario}`}
                      defaultChecked={item.estado === 'Activo'}
                      onChange={() => handleSwitchChange(item)}
                    />
                    <>
                      <CButton
                        color="secondary"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        style={{
                          marginLeft: '5px',
                          backgroundColor: '#c0c0c0',
                        }}
                      >
                        <FaEdit style={{ color: 'black' }} />
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleDelete(item)}
                        style={{ marginLeft: '10px' }}
                      >
                        <FaTrash />
                      </CButton>
                    </>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
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
            {Array.from({ length: Math.ceil(users.length / pageSize) }, (_, i) => (
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
              disabled={currentPage === Math.ceil(users.length / pageSize)}
            >
              Siguiente
            </CPaginationItem>
          </CPagination>
        </CCardBody>
      </CCard>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Editar Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form>
            <div className="mb-3">
              <CFormLabel>Nombre del Usuario</CFormLabel>
              <CFormInput
                type="text"
                defaultValue={selectedItem?.nombre_usuario}
                id="nombreUsuario"
              />
              {errors.nombre_usuario && <div className="text-danger">{errors.nombre_usuario}</div>}
            </div>
            <div className="mb-3">
              <CFormLabel>Correo Electrónico</CFormLabel>
              <CFormInput
                type="email"
                defaultValue={selectedItem?.correo}
                id="correoElectronico"
              />
              {errors.correo && <div className="text-danger">{errors.correo}</div>}
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
    </>
  );
};

export default ListaUsuarios;
