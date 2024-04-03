/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Switch from 'react-switch';
import Swal from 'sweetalert2';
import {
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CButton,
    CInputGroup, // Asegúrate de importar CInputGroup aquí

    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CPagination,
    CPaginationItem,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButtonGroup,
    CFormSwitch,
    CFormLabel,
    CFormInput,
    CBadge, // Asegúrate de importar CBadge aquí
} from '@coreui/react';
import ServicioService from 'src/views/services/servicioService';

const ListaServicios = () => {
    const [visible, setVisible] = useState(false);
    const [servicios, setServicios] = useState(null);


    const [selectedServicioId, setSelectedServicioId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const fetchServicios = async () => {
        try {
            const response = await ServicioService.getAllServicios();
            const data = response.listServicios || [];
            setServicios(data);
            console.log('Servicios:', data);
        } catch (error) {
            console.error('Error al obtener servicios:', error);
            setServicios([]);
        }
    };

    useEffect(() => {
        fetchServicios();
    }, []);

    const handleEditar = (servicio) => {
        setSelectedServicioId(servicio);
        setVisible(true);
    };

    const handleEliminar = async (id) => {
        try {
            const servicio = servicios.find((item) => item.id === id);

            if (servicio && servicio.estado) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No se puede eliminar un servicio activo',
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                await ServicioService.eliminarServicio(id);
                fetchServicios();
                Swal.fire({
                    icon: 'success',
                    title: 'Servicio eliminado',
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } catch (error) {
            console.error('Error al eliminar el servicio:', error);
        }
    };

    const handleGuardarCambios = async () => {
        try {
            console.log('selectedServicioId:', selectedServicioId);

            if (selectedServicioId && typeof selectedServicioId === 'object') {
                if ('id' in selectedServicioId) {
                    console.log('selectedServicioId.id:', selectedServicioId.id);

                    // Actualizar el servicio en el servidor
                    await ServicioService.updateServicio(selectedServicioId.id, selectedServicioId);

                    fetchServicios(); // Actualizar la lista de servicios después de la edición

                    setVisible(false);
                    Swal.fire({
                        icon: 'success',
                        title: 'Cambios guardados',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else {
                    console.error('Error: ID de servicio no definido o válido.');
                }
            } else {
                console.error('Error: Objeto de servicio no definido o válido.');
            }
        } catch (error) {
            console.error('Error al guardar cambios:', error);
        }
    };

    const handleCambiarEstado = async (id) => {
        try {
            const servicioIndex = servicios.findIndex((item) => item.id === id);

            if (servicioIndex !== -1) {
                const confirmacion = await Swal.fire({
                    title: `¿Estás seguro de cambiar el estado del servicio a ${!servicios[servicioIndex].estado ? 'Activo' : 'Inactivo'}?`,
                    text: "¡No podrás revertir esto!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, cambiar estado"
                });

                if (confirmacion.isConfirmed) {
                    const updatedServicios = [...servicios];
                    updatedServicios[servicioIndex] = { ...updatedServicios[servicioIndex], estado: !updatedServicios[servicioIndex].estado };

                    await ServicioService.updateServicio(id, { ...updatedServicios[servicioIndex] });

                    setServicios(updatedServicios);

                    Swal.fire({
                        icon: 'success',
                        title: `Estado del servicio actualizado: ${updatedServicios[servicioIndex].estado ? 'Activo' : 'Inactivo'}`,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            } else {
                console.error('Servicio no encontrado.');
            }
        } catch (error) {
            console.error('Error al cambiar el estado del servicio:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al cambiar el estado del servicio',
            });
        }
    };


    const filteredServicios = servicios
        ? servicios.filter((servicio) =>
            servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedServicios = filteredServicios.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
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
                        <div className="mt-3">
                            <CInputGroup className="mt-3" style={{ maxWidth: "200px" }}>
                                <CFormInput
                                    type="text"
                                    placeholder="Buscar servicio..."
                                    className="form-control-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </CInputGroup>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CTable align='middle' className='mb-0 border' hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    {/* <CTableHeaderCell scope="col">Id</CTableHeaderCell> */}
                                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Valor</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Tiempo</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                                    <CTableHeaderCell scope="col"></CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {Array.isArray(paginatedServicios) &&
                                    paginatedServicios.length > 0 &&
                                    paginatedServicios.map((servicio, index) => (
                                        <CTableRow key={servicio.id}>
                                            {/* <CTableHeaderCell scope="row">{index + 1 + startIndex}</CTableHeaderCell> */}
                                            <CTableDataCell>{servicio.nombre}</CTableDataCell>
                                            <CTableDataCell>{servicio.valor}</CTableDataCell>
                                            <CTableDataCell>{servicio.tiempo}</CTableDataCell>
                                            <CTableDataCell style={{ marginRight: '2px' }}>
                                                <CBadge color={servicio.estado ? 'success' : 'danger'}>
                                                    {servicio.estado ? 'Activo' : 'Inactivo'}
                                                </CBadge>
                                            </CTableDataCell>



                                            <CTableDataCell style={{ display: 'flex', alignItems: 'center' }}>
                                                <CFormSwitch
                                                    size='xl'
                                                    label=""
                                                    id={`formSwitchCheckChecked_${servicio.id}`}
                                                    defaultChecked={servicio.estado}
                                                    onChange={() => handleCambiarEstado(servicio.id)}
                                                    style={{ marginRight: '5px' }} // Ajustar margen derecho para separar el switch del botón de editar
                                                />
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <CButton
                                                        color="secondary"
                                                        size="sm"
                                                        onClick={() => handleEditar(servicio)}
                                                        style={{ marginRight: '5px' }} // Ajustar margen derecho para separar el botón de editar del botón de eliminar
                                                    >
                                                        <FaEdit />
                                                    </CButton>
                                                    <CButton
                                                        color="danger"
                                                        size="sm"
                                                        onClick={() => {
                                                            Swal.fire({
                                                                title: '¿Estás seguro que desea eliminar este servicio?',
                                                                text: 'Esta acción no se puede deshacer.',
                                                                icon: 'warning',
                                                                showCancelButton: true,
                                                                confirmButtonColor: '#d33',
                                                                cancelButtonColor: '#3085d6',
                                                                confirmButtonText: 'Sí, eliminar',
                                                                cancelButtonText: 'Cancelar',
                                                            }).then((result) => {
                                                                if (result.isConfirmed) {
                                                                    handleEliminar(servicio.id);
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <FaTrash />
                                                    </CButton>
                                                </div>
                                            </CTableDataCell>


                                        </CTableRow>
                                    ))}
                            </CTableBody>
                        </CTable>
                        <CPagination align="center" aria-label="Page navigation example" className="mt-3">
                            <CPaginationItem onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                Anterior
                            </CPaginationItem>
                            {Array.from({ length: Math.ceil(filteredServicios.length / pageSize) }, (_, i) => (
                                <CPaginationItem
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    active={i + 1 === currentPage}
                                >
                                    {i + 1}
                                </CPaginationItem>
                            ))}
                            <CPaginationItem
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === Math.ceil(filteredServicios.length / pageSize)}
                            >
                                Siguiente
                            </CPaginationItem>
                        </CPagination>
                    </CCardBody>
                </CCard>
            </CCol>
            <CModal visible={visible} onClose={() => setVisible(false)} backdrop="static">
                <CModalHeader>
                    <CModalTitle>Editar Servicio</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <form>
                        <div className="mb-3">
                            <CFormLabel>Nombre</CFormLabel>
                            <CFormInput
                                type="text"
                                value={selectedServicioId ? selectedServicioId.nombre : ''}
                                onChange={(e) =>
                                    setSelectedServicioId({
                                        ...selectedServicioId,
                                        nombre: e.target.value,
                                    })
                                }
                                placeholder="Ingrese el nombre del servicio"
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Valor</CFormLabel>
                            <CFormInput
                                type="number"
                                step="0.01"
                                value={selectedServicioId ? selectedServicioId.valor : ''}
                                onChange={(e) =>
                                    setSelectedServicioId({
                                        ...selectedServicioId,
                                        valor: e.target.value,
                                    })
                                }
                                placeholder="Ingrese el valor del servicio"
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Tiempo (minutos)</CFormLabel>
                            <CFormInput
                                type="number"
                                value={selectedServicioId ? selectedServicioId.tiempo : ''}
                                onChange={(e) =>
                                    setSelectedServicioId({
                                        ...selectedServicioId,
                                        tiempo: e.target.value,
                                    })
                                }
                                placeholder="Ingrese el tiempo del servicio en minutos"
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

export default ListaServicios;
