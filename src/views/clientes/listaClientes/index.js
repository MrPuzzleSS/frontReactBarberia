import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
    CButtonGroup,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormLabel,
    CFormSelect,
    CFormInput,
    CInputGroup,
    CInputGroupText,
} from '@coreui/react';

function ListaClientes() {
    const [visible, setVisible] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null); // Cliente que se está editando

    // Reemplaza esta lista con datos reales de clientes
    const clientes = [
        {
            id: 1,
            nombre: 'Aaron',
            apellido: 'Vera',
            correo: 'vera@gmail.com',
            documento: 123547,
            telefono: 3148868498,
            estado: 'Activo',
        },
        {
            id: 2,
            nombre: 'Oscar',
            apellido: 'Torres',
            correo: 't99@gmail.com',
            documento: 1019228982,
            telefono: 3009878976,
            estado: 'Activo',
        },
    ];

    const handleEditClick = (cliente) => {
        setEditingCliente(cliente);
        setVisible(true);
    };

    const handleCloseModal = () => {
        setEditingCliente(null);
        setVisible(false);
    };

    // Agrega lógica para guardar los cambios del cliente editado
    const handleSaveChanges = () => {
        // Realiza la lógica para guardar los cambios en la base de datos
        // Después, cierra la ventana modal
        handleCloseModal();
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                            <strong>Lista de Clientes</strong>
                            <Link to="/clientes/crearClientes">
                                <CButton color="primary">Agregar Cliente</CButton>
                            </Link>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CTable>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Apellido</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Correo</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Documento</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {clientes.map((cliente, index) => (
                                    <CTableRow key={cliente.id}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{cliente.nombre}</CTableDataCell>
                                        <CTableDataCell>{cliente.apellido}</CTableDataCell>
                                        <CTableDataCell>{cliente.correo}</CTableDataCell>
                                        <CTableDataCell>{cliente.documento}</CTableDataCell>
                                        <CTableDataCell>{cliente.telefono}</CTableDataCell>
                                        <CTableDataCell>{cliente.estado}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButtonGroup aria-label="Basic mixed styles example">
                                                <CButton
                                                    color="info"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditClick(cliente)}
                                                >
                                                    Editar
                                                </CButton>
                                                <CButton color="warning" size="sm" variant="outline">
                                                    Cambiar Estado
                                                </CButton>
                                            </CButtonGroup>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCol>
            <CModal visible={visible} onClose={handleCloseModal}>
                <CModalHeader>
                    <CModalTitle>Editar Cliente</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <form>
                        <div className="mb-3">
                            <CFormLabel>Nombre</CFormLabel>
                            <CFormInput type="text" defaultValue={editingCliente?.nombre} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Apellido</CFormLabel>
                            <CFormInput type="text" defaultValue={editingCliente?.apellido} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Correo</CFormLabel>
                            <CFormInput type="email" defaultValue={editingCliente?.correo} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Documento</CFormLabel>
                            <CFormInput type="number" defaultValue={editingCliente?.documento} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Teléfono</CFormLabel>
                            <CFormInput type="number" defaultValue={editingCliente?.telefono} />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Estado</CFormLabel>
                            <CFormSelect>
                                <option value="">Selecciona el estado</option>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </CFormSelect>
                        </div>
                    </form>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </CButton>
                    <CButton color="primary" onClick={handleSaveChanges}>
                        Guardar Cambios
                    </CButton>
                </CModalFooter>
            </CModal>
        </CRow>
    );
}

export default ListaClientes;
