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
import InsumoService from 'src/views/services/insumoService';

const ListaInsumos = () => {
    const [visible, setVisible] = useState(false);
    const [insumos, setInsumos] = useState(null);
    const [selectedInsumoId, setSelectedInsumoId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchInsumos = async () => {
        try {
            const response = await InsumoService.getAllInsumos();
            const data = response.listInsumos || [];
            setInsumos(data);
            console.log('Insumos traidos:', data);
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

    const handleEliminar = async (id) => {
        try {
            const insumo = insumos.find((item) => item.id === id);
    
            if (insumo && insumo.estado) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No se puede eliminar un insumo activo',
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                await InsumoService.eliminarInsumo(id);
                fetchInsumos();
                Swal.fire({
                    icon: 'success',
                    title: 'Insumo eliminado',
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } catch (error) {
            console.error('Error al eliminar el insumo:', error);
        }
    };

    const handleGuardarCambios = async () => {
        try {
            console.log('selectedInsumoId:', selectedInsumoId);
            console.log('selectedInsumoId.id:', selectedInsumoId.id);
            if (selectedInsumoId && selectedInsumoId.id) {
                await InsumoService.updateInsumo(selectedInsumoId.id, selectedInsumoId);
                fetchInsumos();
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

    const handleCambiarEstado = async (id) => {
        try {
            const insumoIndex = insumos.findIndex((item) => item.id === id);

            if (insumoIndex !== -1) {
                const updatedInsumos = [...insumos];
                updatedInsumos[insumoIndex] = { ...updatedInsumos[insumoIndex], estado: !updatedInsumos[insumoIndex].estado };

                await InsumoService.updateInsumo(id, { ...updatedInsumos[insumoIndex] });
                setInsumos(updatedInsumos);
            } else {
                console.error('Insumo no encontrado.');
            }
        } catch (error) {
            console.error('Error al cambiar el estado del insumo:', error);
        }
    };

    const filteredInsumos = insumos
        ? insumos.filter((insumo) =>
            insumo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            insumo.cantidad.toString().includes(searchTerm) ||
            insumo.precio.toString().includes(searchTerm)
        )
        : [];

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
                        <CCol xs={3}>
                            <div className="mt-2">
                                <CFormInput
                                    type="text"
                                    placeholder="Buscar insumo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CCol>
                    </CCardHeader>
                    <CCardBody>
                        <CTable align="middle" className="mb-0 border" hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Cantidad</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Precio</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                                    <CTableHeaderCell scope="col"></CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {Array.isArray(filteredInsumos) &&
                                    filteredInsumos.length > 0 &&
                                    filteredInsumos.map((insumo, index) => (
                                        <CTableRow key={insumo.id}>
                                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                            <CTableDataCell>{insumo.nombre}</CTableDataCell>
                                            <CTableDataCell>{insumo.cantidad}</CTableDataCell>
                                            <CTableDataCell>{insumo.precio}</CTableDataCell>
                                            <CTableDataCell>
                                                {insumo.estado ? 'Activo' : 'Inactivo'}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CButtonGroup aria-label="Acciones del insumo">
                                                    <CButton
                                                        color="primary"
                                                        size="sm"
                                                        onClick={() => handleEditar(insumo)}
                                                        disabled={insumo.estado} // Deshabilitar el botón si el insumo está activo
                                                    >
                                                        Editar
                                                    </CButton>
                                                    <CButton
                                                        color="danger"
                                                        size="sm"
                                                        onClick={() => handleEliminar(insumo.id)}
                                                    >
                                                        Eliminar
                                                    </CButton>
                                                    <CButton
                                                        color={insumo.estado ? 'warning' : 'success'}
                                                        size="sm"
                                                        onClick={() => handleCambiarEstado(insumo.id)}
                                                    >
                                                        {insumo.estado ? 'Desactivar' : 'Activar'}
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
                            <CFormLabel>Cantidad</CFormLabel>
                            <CFormInput
                                type="number"
                                value={selectedInsumoId ? selectedInsumoId.cantidad : ''}
                                onChange={(e) =>
                                    setSelectedInsumoId({
                                        ...selectedInsumoId,
                                        cantidad: e.target.value,
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
};

export default ListaInsumos;
