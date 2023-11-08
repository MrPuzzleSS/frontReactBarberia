import React from 'react';
import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CButton } from '@coreui/react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const tableExample = [
    {
      user: { name: 'ADMINISTRADOR' },
      country: { name: 'ADMINISTRADOR' },
      activity: 'ACTIVO'
    },
    {
      user: { name: 'ADMINISTRADOR' },
      country: { name: '' },
      activity: 'ACTIVO'
    },
    {
      user: { name: 'CLIENTE' },
      country: { name: 'EMPLEADO' },
      activity: 'ACTIVO'
    },

  ];

  const handleDelete = () => {
    toast.info('¿Seguro que desea eliminar ROL?');
    setTimeout(() => {
      toast.success('ROL eliminado con éxito');
    }, 3000);
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
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>ROL</CTableHeaderCell>
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
                    <strong>{item.activity}</strong>
                  </CTableDataCell>
                  <CTableDataCell>
                    <Link to="/EditarRol">
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

export default Dashboard;
