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
import ServicioService from 'src/views/services/servicioService'; // Actualiza el servicio si es necesario

const ListaServicios = () => { // Cambiar el nombre de la función de ListaInsumos a ListaServicios
    const [visible, setVisible] = useState(false);
    const [servicios, setServicios] = useState(null); // Cambiar el nombre de insumos a servicios
    const [selectedServicioId, setSelectedServicioId] = useState(null); // Cambiar el nombre de selectedInsumoId a selectedServicioId

    const fetchServicios = async () => { // Cambiar el nombre de fetchInsumos a fetchServicios
        try {
            const response = await ServicioService.getAllServicios(); // Cambiar el nombre del servicio de InsumoService a ServicioService
            const data = response || [];
            setServicios(data); // Cambiar el nombre de insumos a servicios
        } catch (error) {
            console.error('Error al obtener servicios:', error);
            setServicios([]);
        }
    };

    useEffect(() => {
        fetchServicios(); // Cambiar el nombre de fetchInsumos a fetchServicios
    }, []);

    const handleEditar = (servicio) => { // Cambiar el nombre de handleEditarInsumo a handleEditarServicio
        setSelectedServicioId(servicio); // Cambiar el nombre de selectedInsumoId a selectedServicioId
        setVisible(true);
    };

    const handleEliminar = async (id_servicio) => { // Cambiar el nombre de handleEliminarInsumo a handleEliminarServicio
        try {
            await ServicioService.eliminarServicio(id_servicio); // Cambiar el nombre del servicio de InsumoService a ServicioService
            fetchServicios(); // Cambiar el nombre de fetchInsumos a fetchServicios
            Swal.fire({
                icon: 'success',
                title: 'Servicio eliminado',
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error('Error al eliminar el servicio:', error);
        }
    };

    const handleGuardarCambios = async () => { // Cambiar el nombre de handleGuardarCambiosInsumo a handleGuardarCambiosServicio
        try {
            console.log('selectedServicioId:', selectedServicioId);
            console.log('selectedServicioId.id:', selectedServicioId.id_servicio);
            if (selectedServicioId && selectedServicioId.id_servicio) { // Cambiar el nombre de id_insumo a id_servicio
                // Reemplazar las funciones y variables relacionadas con insumos
                await ServicioService.updateServicio(selectedServicioId.id_servicio, selectedServicioId); // Cambiar el nombre del servicio de InsumoService a ServicioService
                fetchServicios(); // Asegúrate de tener una función llamada fetchServicios para actualizar la lista de servicios
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
                            <strong>Lista de Servicios</strong>
                            <Link to="/servicios/crearServicio"> {/* Cambiar la ruta de /insumos/crearInsumo a /servicios/crearServicio */}
                                <CButton color="primary">Agregar Servicio</CButton>
                            </Link>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CTable>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Valor</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {Array.isArray(servicios) && servicios.length > 0 && servicios.map((servicio, index) => ( // Cambiar el nombre de insumos
                                    <CTableRow key={servicio.id_servicio}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{servicio.nombre}</CTableDataCell>
                                        <CTableDataCell>{servicio.valor}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButtonGroup aria-label="Acciones del Servicio">
                                                <CButton
                                                    color="info"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditar(servicio)}
                                                >
                                                    Editar
                                                </CButton>
                                                <CButton
                                                    color="danger"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEliminar(servicio.id_servicio)}
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
