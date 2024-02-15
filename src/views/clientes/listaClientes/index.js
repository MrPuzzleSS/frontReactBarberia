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
import ClienteService from 'src/views/services/clienteService'; // Actualiza el servicio si es necesario

const ListaClientes = () => {
    const [visible, setVisible] = useState(false);
    const [clientes, setClientes] = useState(null);
    const [selectedClienteId, setSelectedClienteId] = useState(null);

    const fetchClientes = async () => {
        try {
            const response = await ClienteService.getAllClientes();
            const data = response.listClientes || [];
            setClientes(data);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            setClientes([]);
        }
    };


    useEffect(() => {
        fetchClientes();
    }, []);

    const handleEditar = (cliente) => {
        setSelectedClienteId(cliente);
        setVisible(true);
    };

    const handleEliminar = async (id_cliente) => {
        try {
            await ClienteService.eliminarCliente(id_cliente);
            fetchClientes();
            Swal.fire({
                icon: 'success',
                title: 'Cliente eliminado',
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error('Error al eliminar el cliente:', error);
        }
    };

    const handleGuardarCambios = async () => {
        try {
            console.log('selectedClienteId:', selectedClienteId);
            console.log('selectedClienteId.id:', selectedClienteId.id_cliente);
            if (selectedClienteId && selectedClienteId.id_cliente) {
                await ClienteService.updateCliente(selectedClienteId.id_cliente, selectedClienteId);
                fetchClientes();
                setVisible(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Cambios guardados',
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                console.error('Error: ID de cliente no definido o válido.');
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
                            
                            <strong>Lista de Clientes</strong>
                            <Link to="/Clientes/CrearClientes">
                                <CButton color="primary">Agregar Cliente</CButton>
                            </Link>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                       
                        <CTable align="middle" className="mb-0 border" hover responsive>

                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Apellido</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Documento</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Correo</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {Array.isArray(clientes) && clientes.length > 0 && clientes.map((cliente, index) => (
                                    <CTableRow key={cliente.id_cliente}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{cliente.nombre}</CTableDataCell>
                                        <CTableDataCell>{cliente.apellido}</CTableDataCell>
                                        <CTableDataCell>{cliente.documento}</CTableDataCell>
                                        <CTableDataCell>{cliente.correo}</CTableDataCell>
                                        <CTableDataCell>{cliente.telefono}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButtonGroup aria-label="Acciones del Cliente">
                                                <CButton
                                                    color="primary" // Cambiado a "primary" para hacerlo azul
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditar(cliente)}
                                                >
                                                    Editar
                                                </CButton>
                                                <CButton
                                                    color="danger" // Cambiado a "danger" para hacerlo rojo
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEliminar(cliente.id_cliente)}
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
                    <CModalTitle>Editar Cliente</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <form>
                        <div className="mb-3">
                            <CFormLabel>Nombre</CFormLabel>
                            <CFormInput
                                type="text"
                                value={selectedClienteId ? selectedClienteId.nombre : ''}
                                onChange={(e) =>
                                    setSelectedClienteId({
                                        ...selectedClienteId,
                                        nombre: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Apellido</CFormLabel>
                            <CFormInput
                                type="text"
                                value={selectedClienteId ? selectedClienteId.apellido : ''}
                                onChange={(e) =>
                                    setSelectedClienteId({
                                        ...selectedClienteId,
                                        apellido: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Documento</CFormLabel>
                            <CFormInput
                                type="number"
                                value={selectedClienteId ? selectedClienteId.documento : ''}
                                onChange={(e) =>
                                    setSelectedClienteId({
                                        ...selectedClienteId,
                                        documento: e.target.value,
                                    })
                                }
                                disabled={true} // Aquí estableces el campo como deshabilitado
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Correo</CFormLabel>
                            <CFormInput
                                type="email"
                                value={selectedClienteId ? selectedClienteId.correo : ''}
                                onChange={(e) =>
                                    setSelectedClienteId({
                                        ...selectedClienteId,
                                        correo: e.target.value, // Aquí debes usar `correo` en lugar de `Correo`
                                    })
                                }
                            />

                        </div>

                        <div className="mb-3">
                            <CFormLabel>Teléfono</CFormLabel>
                            <CFormInput
                                type="text"
                                value={selectedClienteId ? selectedClienteId.telefono : ''}
                                onChange={(e) =>
                                    setSelectedClienteId({
                                        ...selectedClienteId,
                                        telefono: e.target.value,
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

export default ListaClientes;
