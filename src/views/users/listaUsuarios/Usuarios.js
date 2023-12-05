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
  CModalBody,
  CModalFooter,
  CFormLabel,
  CFormInput,
} from '@coreui/react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const ListaUsuarios = () => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get('https://resapibarberia.onrender.com/api/rol');
        const usuariosResponse = await axios.get('https://resapibarberia.onrender.com/api/usuario');

        setRoles(rolesResponse.data.listaRoles);
        setUsers(usuariosResponse.data.usuarios || []);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        toast.error('Error al cargar datos');
      }
    };

    fetchData();
  }, []);

  const getRolNombre = (id_rol) => {
    const rol = roles.find((r) => r.id_rol === id_rol);
    return rol ? rol.nombre : 'Rol Desconocido';
  };

  const handleDelete = async (item) => {
    try {
      await axios.delete(`https://resapibarberia.onrender.com/api/usuario/${item.id_usuario}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id_usuario !== item.id_usuario));
      toast.success('Usuario eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      toast.error('Error al eliminar usuario');
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

      toast.success('Usuario editado con éxito');
    } catch (error) {
      console.error('Error al editar usuario:', error);
      toast.error('Error al editar usuario');
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
                    <CButton color="danger" onClick={() => handleDelete(item)}>
                      Eliminar
                    </CButton>
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

      <ToastContainer />
    </>
  );
};

export default ListaUsuarios;
