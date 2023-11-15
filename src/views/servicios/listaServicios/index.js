import React, { useState } from 'react';
import { CButtonGroup } from '@coreui/react';
import { Link } from 'react-router-dom';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormLabel,
    CFormInput,
    CFormSelect,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react';

function ListaServicios() {
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Lista de servicios (reemplaza con tus datos reales)
    const servicios = [
        {
            id: 1,
            nombre: 'Servicio 1',
            valor: 100,
        },
        {
            id: 2,
            nombre: 'Servicio 2',
            valor: 150,
        },
    ];

    // Función para abrir/cerrar el modal
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard>
                        <CCardHeader>
                            <div className="d-flex justify-content-between align-items-center">
                                <strong>Lista de Servicios</strong>
                                <Link to="/servicios/crearServicio">
                                    <CButton color="primary">Agregar Servicio</CButton>
                                </Link>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">ID Servicio</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Valor</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {servicios.map((servicio, index) => (
                                        <CTableRow key={servicio.id}>
                                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                            <CTableDataCell>{servicio.id}</CTableDataCell>
                                            <CTableDataCell>{servicio.nombre}</CTableDataCell>
                                            <CTableDataCell>{servicio.valor}</CTableDataCell>
                                            <CTableDataCell>
                                                <CButtonGroup aria-label="Basic mixed styles example">
                                                    <CButton
                                                        color="info"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={toggleModal}
                                                    >
                                                        Editar
                                                    </CButton>
                                                    <CButton color="danger" size="sm" variant="outline">
                                                        Eliminar
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
            </CRow>

            <CModal visible={isModalVisible} onClose={toggleModal}>
                <CModalHeader>
                    <CModalTitle>Editar Servicio</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <form>
                        <div className="mb-3">
                            <CFormLabel>ID del Servicio</CFormLabel>
                            <CFormInput type="number" />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Nombre del Servicio</CFormLabel>
                            <CFormInput type="text" />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Valor del Servicio</CFormLabel>
                            <CFormInput type="number" />
                        </div>
                    </form>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={toggleModal}>
                        Cerrar
                    </CButton>
                    <CButton color="primary">Guardar Cambios</CButton>
                </CModalFooter>
            </CModal>
        </>
    );
}

export default ListaServicios;
