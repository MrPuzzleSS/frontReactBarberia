import React, { useState, useEffect } from 'react';
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
} from '@coreui/react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedRole, setEditedRole] = useState({ nombre: '', estado: '' });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('https://resapibarberia.onrender.com/api/rol');
        console.log('Respuesta de la API:', response.data);

        if (response.data && Array.isArray(response.data.listaRoles)) {
          setRoles(response.data.listaRoles);
        } else {
          console.error('La respuesta de la API no contiene un array de roles válido:', response.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener la lista de roles:', error);
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleAddRole = async (newRoleData) => {
    try {
      const response = await axios.post('https://resapibarberia.onrender.com/api/rol', newRoleData);
      console.log('Respuesta al agregar rol:', response.data);

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
      console.log('Respuesta al editar rol:', response.data);

      setRoles(roles.map(role => (role.id_rol === id ? response.data : role)));

      toast.success('Rol editado con éxito');
    } catch (error) {
      console.error('Error al editar rol:', error);
      toast.error('Error al editar rol');
    }
  };
  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditedRole({
      nombre: item.nombre,
      estado: item.estado,
    });
    setVisible(true);
  };

  const handleDelete = async (idToDelete) => {
    try {
      if (!idToDelete) {
        console.error('El ID a eliminar es nulo o indefinido');
        toast.error('Error al eliminar rol');
        return;
      }
  
      const response = await axios.delete(`https://resapibarberia.onrender.com/api/rol/${idToDelete}`);
      console.log('Respuesta al eliminar rol:', response.data);
  
      setRoles((prevRoles) => prevRoles.filter((role) => role.id_rol !== idToDelete));
  
      toast.success('Rol eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      toast.error('Error al eliminar rol');
    } finally {
      setSelectedItem(null);
    }
  };

  

  const handleSaveChanges = async () => {
    try {
      const { nombre, estado } = editedRole;

      if (selectedItem) {
        // Editar un rol existente
        await handleEditRole(selectedItem.id_rol, { nombre, estado });
      } else {
        // Agregar un nuevo rol
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
                      <CButton color="primary" className="me-1" onClick={() => handleEdit(item)}>
                        Editar
                      </CButton>
                      <CButton color="danger" onClick={() => handleDelete(item.id_rol)}>
                        Eliminar
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}



              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      {/* Modal de Edición */}
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
              <CFormInput
                type="text"
                value={editedRole.estado}
                onChange={(e) => setEditedRole({ ...editedRole, estado: e.target.value })}
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

export default Dashboard;
