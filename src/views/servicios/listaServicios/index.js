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
        if (servicio.estado) {
            // El servicio está activo, no permitir la edición
            Swal.fire({
                icon: 'warning',
                title: 'No se puede editar un servicio activo',
                showConfirmButton: false,
                timer: 1500,
            });
        } else {
            // El servicio no está activo, permitir la edición
            setSelectedServicioId(servicio);
            setVisible(true);
        }
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
            // Obtener el servicio por ID
            const servicioIndex = servicios.findIndex((item) => item.id === id);

            if (servicioIndex !== -1) {
                const updatedServicios = [...servicios];
                updatedServicios[servicioIndex] = { ...updatedServicios[servicioIndex], estado: !updatedServicios[servicioIndex].estado };

                // Actualizar el servicio en el servidor
                await ServicioService.updateServicio(id, { ...updatedServicios[servicioIndex] });

                // Actualizar la lista de servicios después de la edición
                setServicios(updatedServicios);

                Swal.fire({
                    icon: 'success',
                    title: `Estado del servicio actualizado: ${updatedServicios[servicioIndex].estado ? 'Activo' : 'Inactivo'}`,
                    showConfirmButton: false,
                    timer: 1500,
                });
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
                        <CCol xs={3}>
                            <div className="mt-2">
                                <CFormInput
                                    type="text"
                                    placeholder="Buscar servicio..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CCol>
                    </CCardHeader>
                    <CCardBody>
                        <CTable>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Valor</CTableHeaderCell>
                                    
                                    <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                                    <CTableHeaderCell scope="col"></CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {Array.isArray(paginatedServicios) &&
                                    paginatedServicios.length > 0 &&
                                    paginatedServicios.map((servicio, index) => (
                                        <CTableRow key={servicio.id}>
                                            <CTableHeaderCell scope="row">{index + 1 + startIndex}</CTableHeaderCell>
                                            <CTableDataCell>{servicio.nombre}</CTableDataCell>
                                            <CTableDataCell>{servicio.valor}</CTableDataCell>
                                            

                                            <CTableDataCell>
                                                <CButtonGroup aria-label="Acciones del Servicio">
                                                <CTableDataCell>
                                            <CButton
                                                style={{
                                                    marginRight: '20px',
                                                    marginTop: '1px',  // Ajusta el margen superior según tus necesidades
                                                    backgroundColor: servicio.estado ? '#12B41A  ' : 'red  ',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '12px',  // Ajusta el tamaño del texto según tus necesidades
                                                    padding: '3px 15px',  // Ajusta el espaciado interno según tus necesidades
                                                    border: '0px solid #333',
                                                }}
                                            >
                                                {servicio.estado ? 'Activo' : 'Inactivo'}
                                            </CButton>
                                            </CTableDataCell>
                                                    <div style={{ marginTop: '5px', marginRight: '20px'}}>
                                                                
                                                        <Switch
                                                            onChange={() => handleCambiarEstado(servicio.id)}
                                                            checked={servicio.estado}
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
                                                        onClick={() => handleEditar(servicio)}
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
                                                                title: '¿Estás seguro que desea  eliminar este servicio?',
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
                                { length: Math.ceil(filteredServicios.length / pageSize) },
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
                                    currentPage === Math.ceil(filteredServicios.length / pageSize)
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
