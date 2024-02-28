/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Switch from 'react-switch';
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
    CPagination,
    CPaginationItem,
} from '@coreui/react';
import InsumoService from 'src/views/services/insumoService';

const ListaInsumos = () => {
    const [visible, setVisible] = useState(false);
    const [insumos, setInsumos] = useState(null);
    const [selectedInsumoId, setSelectedInsumoId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

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
        if (insumo.estado) {
            // El insumo está activo, no permitir la edición
            Swal.fire({
                icon: 'warning',
                title: 'No se puede editar un insumo activo',
                showConfirmButton: false,
                timer: 1500,
            });
        } else {
            // El insumo no está activo, permitir la edición
            setSelectedInsumoId(insumo);
            setVisible(true);
        }
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
            // Obtener el insumo por ID
            const insumoIndex = insumos.findIndex((item) => item.id === id);

            if (insumoIndex !== -1) {
                const updatedInsumos = [...insumos];
                updatedInsumos[insumoIndex] = {
                    ...updatedInsumos[insumoIndex],
                    estado: !updatedInsumos[insumoIndex].estado,
                };

                // Actualizar el insumo en el servidor
                await InsumoService.updateInsumo(id, { ...updatedInsumos[insumoIndex] });

                // Actualizar la lista de insumos después de la edición
                setInsumos(updatedInsumos);

                Swal.fire({
                    icon: 'success',
                    title: `Estado del insumo actualizado: ${
                        updatedInsumos[insumoIndex].estado ? 'Activo' : 'Inactivo'
                    }`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                console.error('Insumo no encontrado.');
            }
        } catch (error) {
            console.error('Error al cambiar el estado del insumo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al cambiar el estado del insumo',
            });
        }
    };

    const filteredInsumos = insumos
        ? insumos.filter((insumo) =>
              insumo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
              insumo.cantidad.toString().includes(searchTerm) ||
              insumo.precio.toString().includes(searchTerm)
          )
        : [];

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedInsumos = filteredInsumos.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
                                {Array.isArray(paginatedInsumos) &&
                                    paginatedInsumos.length > 0 &&
                                    paginatedInsumos.map((insumo, index) => (
                                        <CTableRow key={insumo.id}>
                                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                            <CTableDataCell>{insumo.nombre}</CTableDataCell>
                                            <CTableDataCell>{insumo.cantidad}</CTableDataCell>
                                            <CTableDataCell>{insumo.precio}</CTableDataCell>
                                            
                                            <CTableDataCell>
                                                <CButtonGroup aria-label="Acciones del insumo">
                                                <CTableDataCell>
                                            <CButton
                                                style={{
                                                    marginRight: '20px',
                                                    marginTop: '1px',  // Ajusta el margen superior según tus necesidades
                                                    backgroundColor: insumo.estado ? '#12B41A  ' : 'red  ',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '12px',  // Ajusta el tamaño del texto según tus necesidades
                                                    padding: '3px 15px',  // Ajusta el espaciado interno según tus necesidades
                                                    border: '0px solid #333',
                                                }}
                                            >
                                                {insumo.estado ? 'Activo' : 'Inactivo'}
                                            </CButton>
                                            </CTableDataCell>
                                                <div style={{ marginTop: '5px', marginRight: '20px'}}>
                                                                
                                                                <Switch
                                                                    onChange={() => handleCambiarEstado(insumo.id)}
                                                                    checked={insumo.estado}
                                                                    onColor="#001DAE"
                                                                    onHandleColor="#FFFFFF"
                                                                    handleDiameter={15}
                                                                    uncheckedIcon={false}
                                                                    checkedIcon={false}
                                                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                                                    height={20}
                                                                    width={33}
                                                                />
                                                            </div>
                                                    <CButton
                                                        color="primary"
                                                        size="sm"
                                                        onClick={() => handleEditar(insumo)}
                                                        style={{
                                                            marginRight: '20px',
                                                            backgroundColor: 'orange',
                                                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                                            padding: '3px 10px',
                                                            borderRadius: '10px',
                                                        }}
                                                    >
                                                        <FaEdit style={{ color: 'black' }} />
                                                    </CButton>
                                                    <CButton
                                                        color="danger"
                                                        size="sm"
                                                        onClick={() => {
                                                            Swal.fire({
                                                                title: '¿Estás seguro que desea  eliminar este insumo?',
                                                                text: 'Esta acción no se puede deshacer.',
                                                                icon: 'warning',
                                                                showCancelButton: true,
                                                                confirmButtonColor: '#d33',
                                                                cancelButtonColor: '#3085d6',
                                                                confirmButtonText: 'Sí, eliminar',
                                                                cancelButtonText: 'Cancelar',
                                                                
                                                            }).then((result) => {
                                                                if (result.isConfirmed) {
                                                                    handleEliminar(insumo.id);
                                                                }
                                                            });
                                                        }}
                                                        style={{
                                                            borderRadius: '10px',  // Ajusta el radio de los bordes según tus necesidades
                                                        }}
                                                    >
                                                       <FaTrash /> {/* Icono de eliminar */}
                                                    </CButton>
                                                </CButtonGroup>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                            </CTableBody>
                        </CTable>
                        <CPagination
                            align="center"
                            aria-label="Page navigation example"
                            className="mt-3"
                        >
                            <CPaginationItem
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </CPaginationItem>
                            {Array.from(
                                { length: Math.ceil(filteredInsumos.length / pageSize) },
                                (_, i) => (
                                    <CPaginationItem
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        active={i + 1 === currentPage}
                                    >
                                        {i + 1}
                                    </CPaginationItem>
                                )
                            )}
                            <CPaginationItem
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={
                                    currentPage === Math.ceil(filteredInsumos.length / pageSize)
                                }
                            >
                                Siguiente
                            </CPaginationItem>
                        </CPagination>
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
