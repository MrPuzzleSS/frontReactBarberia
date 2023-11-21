import React, { useState } from 'react';
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
    CButtonGroup,
} from '@coreui/react';

function ListaInsumos() {
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Lista de insumos (reemplaza con tus datos reales)
    const insumos = [
        {
            id: 1,
            nombre: 'Insumo 1',
            valor: 100,
            cantidad: 10, // Agregar cantidad
        },
        {
            id: 2,
            nombre: 'Insumo 2',
            valor: 150,
            cantidad: 5, // Agregar cantidad
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
                                <strong>Lista de Insumos</strong>
                                <Link to="/insumos/crearInsumo">
                                    <CButton color="primary">Agregar Insumo</CButton>
                                </Link>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">ID Insumo</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Valor</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Cantidad</CTableHeaderCell> {/* Agregar cantidad */}
                                        <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {insumos.map((insumo, index) => (
                                        <CTableRow key={insumo.id}>
                                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                            <CTableDataCell>{insumo.id}</CTableDataCell>
                                            <CTableDataCell>{insumo.nombre}</CTableDataCell>
                                            <CTableDataCell>{insumo.valor}</CTableDataCell>
                                            <CTableDataCell>{insumo.cantidad}</CTableDataCell> {/* Agregar cantidad */}
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
                    <CModalTitle>Editar Insumo</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <form>
                        <div className="mb-3">
                            <CFormLabel>ID del Insumo</CFormLabel>
                            <CFormInput type="number" />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Nombre del Insumo</CFormLabel>
                            <CFormInput type="text" />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Valor del Insumo</CFormLabel>
                            <CFormInput type="number" />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Cantidad del Insumo</CFormLabel> {/* Agregar cantidad */}
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

export default ListaInsumos;
