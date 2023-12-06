import React, { useState, useEffect } from 'react';
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
  CFormSwitch,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CFormInput,
} from '@coreui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ListaUsuarios = () => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get('https://resapibarberia.onrender.com/api/rol');
        let usuariosResponse;

        // Check if there's a search ID
        if (searchId) {
          // Fetch the user by ID
          usuariosResponse = await axios.get(`https://resapibarberia.onrender.com/api/usuario/${searchId}`);
          setUsers(usuariosResponse.data ? [usuariosResponse.data] : []);
        } else {
          // Fetch all users
          usuariosResponse = await axios.get('https://resapibarberia.onrender.com/api/usuario');
          setUsers(usuariosResponse.data.usuarios || []);
        }

        setRoles(rolesResponse.data.listaRoles);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchData();
  }, [searchId]); // Agregar searchId como dependencia

  const getRolNombre = (id_rol) => {
    const rol = roles.find((r) => r.id_rol === id_rol);
    return rol ? rol.nombre : 'Rol Desconocido';
  };

  const handleDelete = async (item) => {
    try {
      await axios.delete(`https://resapibarberia.onrender.com/api/usuario/${item.id_usuario}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id_usuario !== item.id_usuario));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      // Puedes manejar el error según tus necesidades
    } finally {
      setSelectedItem(null);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setVisible(true);
  };

  const handleSaveChanges = async () => {
    try {
      const editedUser = {
        ...selectedItem,
        nombre_usuario: document.getElementById('nombreUsuario').value,
        correo: document.getElementById('correoElectronico').value,
        // Agrega más campos según tu necesidad
      };

      await axios.put(`https://resapibarberia.onrender.com/api/usuario/${editedUser.id_usuario}`, editedUser);

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id_usuario === selectedItem.id_usuario ? editedUser : user))
      );
    } catch (error) {
      console.error('Error al editar usuario:', error);
      // Puedes manejar el error según tus necesidades
    } finally {
      setVisible(false);
    }
  };

  return (
    <>
      <br />
      <CCard className="mb-4">
        <CCardHeader>LISTA DE USUARIOS</CCardHeader>
        <CCardBody>
          {/* Barra de búsqueda por ID */}
          <div className="mb-3">
            <CFormLabel>BUSCAR USUARIO POR ID</CFormLabel>
            <div className="d-flex">
              <CFormInput
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />

            </div>
          </div>

          <Link to="/CrearUsuarios">
            <CButton color="success" className="me-1">
              CREAR
            </CButton>
          </Link>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>NOMBRE</CTableHeaderCell>
                <CTableHeaderCell>CORREO</CTableHeaderCell>
                <CTableHeaderCell>ESTADO</CTableHeaderCell>
                <CTableHeaderCell>ROL</CTableHeaderCell>
                <CTableHeaderCell>ACCIONES</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {users.map((item) => (
                <CTableRow key={item.id_usuario}>
                  <CTableDataCell>
                    <div>{item.id_usuario}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{item.nombre_usuario}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{item.correo}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <strong>{item.estado}</strong>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{getRolNombre(item.id_rol)}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" className="me-1" onClick={() => handleEdit(item)}>
                      Editar
                    </CButton>
                    <CFormSwitch
                      size="xl"
                      label=""
                      id="formSwitchCheckChecked"
                      defaultChecked
                    />

                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal de Edición */}
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
            </div>
            <div className="mb-3">
              <CFormLabel>Correo Electrónico</CFormLabel>
              <CFormInput
                type="email"
                defaultValue={selectedItem?.correo}
                id="correoElectronico"
              />
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
