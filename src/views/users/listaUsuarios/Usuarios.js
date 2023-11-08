import React from 'react';
import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CButton } from '@coreui/react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListaUsuarios = () => {
  const tableExample = [
    {
      user: { name: 'Simon zuleta' },
      country: { name: 'szh@hotmail.com' },
      activity: 'ACTIVO'
    },
    {
      user: { name: 'Jane Smith' },
      country: { name: 'Canada' },
      activity: 'ACTIVO'
    },
    // ... (añade más datos según tus necesidades)
  ];

  const handleDelete = () => {
    toast.info('¿Seguro que desea eliminar?');
    setTimeout(() => {
      toast.success('Usuario eliminado con éxito');
    }, 3000);
  };

  return (
    <>
    <br>
    </br>
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
                <CTableHeaderCell>ACCIONES</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {tableExample.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>
                    <div>{index + 1}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{item.user.name}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{item.country.name}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <strong>{item.activity}</strong>
                  </CTableDataCell>
                  <CTableDataCell>
                    <Link to="/EditarUsuarios">
                      <CButton color="primary" className="me-1">
                        Editar
                      </CButton>
                    </Link>
                    <CButton color="danger" onClick={handleDelete}>
                      Eliminar
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
      <ToastContainer />
    </>
  );
};

export default ListaUsuarios;
