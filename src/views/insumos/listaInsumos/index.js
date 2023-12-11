/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
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
    CFormInput,
} from '@coreui/react';
import InsumoService from 'src/views/services/insumoService'; // Actualiza el servicio si es necesario

const ListaInsumos = () => {
    const [visible, setVisible] = useState(false);
    const [insumos, setInsumos] = useState(null);
    const [selectedInsumoId, setSelectedInsumoId] = useState(null);

    const fetchInsumos = async () => {
        try {
            const response = await InsumoService.getAllInsumos();
            const data = response || [];
            setInsumos(data);
        } catch (error) {
            console.error('Error al obtener insumos:', error);
            setInsumos([]);
        }
    };

    useEffect(() => {
        fetchInsumos();
    }, []);

    const handleEditar = (insumo) => {
        setSelectedInsumoId(insumo);
        setVisible(true);
    };

    const handleEliminar = async (id_insumo) => {
        try {
            await InsumoService.eliminarInsumo(id_insumo);
            fetchInsumos();
            Swal.fire({
                icon: 'success',
                title: 'Insumo eliminado',
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error('Error al eliminar el insumo:', error);
        }
    };

    const handleGuardarCambios = async () => {
        try {
            console.log('selectedInsumoId:', selectedInsumoId);
            console.log('selectedInsumoId.id:', selectedInsumoId.id_insumo);
            if (selectedInsumoId && selectedInsumoId.id_insumo) {
                // Reemplazar las funciones y variables relacionadas con insumos
                await InsumoService.updateInsumo(selectedInsumoId.id_insumo, selectedInsumoId);
                fetchInsumos(); // Asegúrate de tener una función llamada fetchInsumos para actualizar la lista de insumos
                setVisible(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Cambios guardados',
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                console.error('Error: ID de insumo no definido o válido.');
            }
        } catch (error) {
            console.error('Error al guardar cambios:', error);
        }
    };
    

    return (
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
                                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Stock</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Precio</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {Array.isArray(insumos) && insumos.length > 0 && insumos.map((insumo, index) => (
                                    <CTableRow key={insumo.id_insumo}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{insumo.nombre}</CTableDataCell>
                                        <CTableDataCell>{insumo.stock}</CTableDataCell>
                                        <CTableDataCell>{insumo.precio}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButtonGroup aria-label="Acciones del Insumo">
                                                <CButton
                                                    color="info"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditar(insumo)}
                                                >
                                                    Editar
                                                </CButton>
                                                <CButton
                                                    color="danger"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEliminar(insumo.id_insumo)}
                                                >
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

            <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Editar Insumo</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <form>
                        <div className="mb-3">
                            <CFormLabel>Nombre</CFormLabel>
                            <CFormInput
                                type="text"
                                value={selectedInsumoId ? selectedInsumoId.nombre : ''}
                                onChange={(e) =>
                                    setSelectedInsumoId({
                                        ...selectedInsumoId,
                                        nombre: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Stock</CFormLabel>
                            <CFormInput
                                type="number"
                                value={selectedInsumoId ? selectedInsumoId.stock : ''}
                                onChange={(e) =>
                                    setSelectedInsumoId({
                                        ...selectedInsumoId,
                                        stock: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Precio</CFormLabel>
                            <CFormInput
                                type="number"
                                step="0.01"
                                value={selectedInsumoId ? selectedInsumoId.precio : ''}
                                onChange={(e) =>
                                    setSelectedInsumoId({
                                        ...selectedInsumoId,
                                        precio: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </form>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Cerrar
                    </CButton>
                    <CButton color="primary" onClick={handleGuardarCambios}>
                        Guardar Cambios
                    </CButton>
                </CModalFooter>
            </CModal>
        </CRow>
    );
}

export default ListaInsumos;
