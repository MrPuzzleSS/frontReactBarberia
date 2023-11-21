/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
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
import ControlledSwitches from 'src/components/Swtichcomponent';
import { show_alert } from 'src/components/functions';

function ListaProveedores() {
  const url='https://resapibarberia.onrender.com/api/proveedores';
  const [proveedores, setProveedores] = useState([]);
  const [id_proveedor,setId_proveedor]= useState('');
  const [nombre,setNombre]= useState('');
  const [direccion,setDireccion]= useState('');
  const [telefono,setTelefono]= useState('');
  const [email,setEmail]= useState('');
  const [tipo_de_producto_servico,setTipo_de_producto_servicio]= useState('');
  const [operation,setOperation]= useState(1);
  const [title,setTitle]= useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const respuesta = await axios.get(url);
        setProveedores(respuesta.data.listProveedores); // Accede a la propiedad listProveedores
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
  
    fetchData();
  }, []);
  
  const [visible, setVisible] = useState(false)

  const [editingProveedor, setEditingProveedor] = useState({
    id: '',
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    tipo_de_producto_servicio: '',
  });
  

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Lista de Proveedores</strong>
              <Link to="/proveedores/crear-proveedor">
                <CButton color="success">Agregar Proveedor</CButton>
              </Link>
            </div>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Dirección</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Correo Electrónico</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Producto o Servicio</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {proveedores.map((proveedor, i) => (
                  <CTableRow key={proveedor.id_proveedor}>
                    <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                    <CTableDataCell>{proveedor.nombre}</CTableDataCell>
                    <CTableDataCell>{proveedor.direccion}</CTableDataCell>
                    <CTableDataCell>{proveedor.telefono}</CTableDataCell>
                    <CTableDataCell>{proveedor.email}</CTableDataCell>
                    <CTableDataCell>{proveedor.tipo_de_producto_servicio}</CTableDataCell>
                    <CTableDataCell>
                    <CButton
                          color="primary"
                          size="sm"
                          onClick={() => setVisible(!visible)}
                        >
                          Editar
                        </CButton>
                        <ControlledSwitches />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Editar Proveedor</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form>
            <div className="mb-3">
              <CFormLabel>Nombre</CFormLabel>
              <CFormInput type="text" />
            </div>
            <div className="mb-3">
              <CFormLabel>Dirección</CFormLabel>
              <CFormInput type="text" />
            </div>
            <div className="mb-3">
              <CFormLabel>Teléfono</CFormLabel>
              <CFormInput type="tel" />
            </div>
            <div className="mb-3">
              <CFormLabel>Correo Electrónico</CFormLabel>
              <CFormInput type="email" />
            </div>
            <div className="mb-3">
              <CFormLabel>Tipo de Producto o Servicio</CFormLabel>
              <CFormInput type="text" />
            </div>
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cerrar
          </CButton>
          <CButton color="primary">Guardar Cambios</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
}

export default ListaProveedores;
