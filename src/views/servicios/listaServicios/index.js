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
import ServicioService from 'src/views/services/servicioService';

const ListaServicios = () => {
    const [visible, setVisible] = useState(false);
    const [servicios, setServicios] = useState(null);
    const [selectedServicioId, setSelectedServicioId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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
        console.log('Editando servicio:', servicio);
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
                                {Array.isArray(filteredServicios) &&
                                    filteredServicios.length > 0 &&
                                    filteredServicios.map((servicio, index) => (
                                        <CTableRow key={servicio.id}>
                                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                            <CTableDataCell>{servicio.nombre}</CTableDataCell>
                                            <CTableDataCell>{servicio.valor}</CTableDataCell>
                                            <CTableDataCell>
                                                {servicio.estado ? 'Activo' : 'Inactivo'}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CButtonGroup aria-label="Acciones del Servicio">
                                                    <CButton
                                                        color="primary"
                                                        size="sm"
                                                        onClick={() => handleEditar(servicio)}
                                                        disabled={servicio.estado} // Deshabilitar el botón si el servicio está activo
                                                    >
                                                        Editar
                                                    </CButton>
                                                    <CButton
                                                        color="danger"
                                                        size="sm"
                                                        onClick={() => handleEliminar(servicio.id)}
                                                    >
                                                        Eliminar
                                                    </CButton>
                                                    <CButton
                                                        color={servicio.estado ? 'warning' : 'success'}
                                                        size="sm"
                                                        onClick={() => handleCambiarEstado(servicio.id)}
                                                    >
                                                        {servicio.estado ? 'Desactivar' : 'Activar'}
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
