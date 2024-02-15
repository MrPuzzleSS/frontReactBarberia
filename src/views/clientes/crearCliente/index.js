import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormLabel,
    CFormInput,
    CRow,
} from '@coreui/react';
import ClienteService from 'src/views/services/clienteService';

function CrearCliente() {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [documento, setDocumento] = useState(''); // Nuevo estado para el campo de documento

    const fetchClientes = async () => {
        try {
            const data = await ClienteService.getAllClientes();
            console.log('Clientes obtenidos:', data.Clientes);
        } catch (error) {
            console.log('Error al obtener clientes:', error);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const handleGuardarCliente = async (e) => {
        e.preventDefault();

        if (!nombre.trim() || !apellido.trim() || !correo.trim() || !telefono.trim() || !documento.trim()) { // Añadido documento a la validación
            Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
            return;
        }

        if (!/^[a-zA-Z]{2,}$/.test(nombre) || !/^[a-zA-Z]{2,}$/.test(apellido)) {
            Swal.fire('Error', 'Nombre y apellido deben contener solo letras y tener al menos 2 caracteres.', 'error');
            return;
        }

        // Dentro de la función handleGuardarCliente
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            Swal.fire('Error', 'El correo electrónico no es válido.', 'error');
            return;
        }



        if (!/^\d{7,}$/.test(telefono)) {
            Swal.fire('Error', 'El teléfono no es válido.', 'error');
            return;
        }

        // Validación para el documento, que en este caso se asume como un número
        if (!/^\d+$/.test(documento)) {
            Swal.fire('Error', 'El documento debe contener solo números.', 'error');
            return;
        }

        const newCliente = {
            nombre,
            apellido,
            correo,
            telefono,
            documento, 
            // Se agrega el documento al objeto del nuevo cliente
        };
        console.log('este es ',newCliente);

        try {
            const response = await ClienteService.createCliente(newCliente);
            console.log('Cliente creado:', response);

            setNombre('');
            setApellido('');
            setCorreo('');
            setTelefono('');
            setDocumento(''); // Se reinicia el estado del documento

            Swal.fire('Éxito', 'Cliente creado correctamente.', 'success');
        } catch (error) {
            console.error('Error al crear el cliente:', error);
            Swal.fire('Error', 'Hubo un problema al crear el cliente.', 'error');
        }

    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardHeader>
                        <strong>Crear Cliente</strong>
                    </CCardHeader>
                    <CCardBody>
                        <form onSubmit={handleGuardarCliente}>
                            <div className="mb-3">
                                <CFormLabel>Nombre</CFormLabel>
                                <CFormInput
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Apellido</CFormLabel>
                                <CFormInput
                                    type="text"
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Correo</CFormLabel>
                                <CFormInput
                                    type="email"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <CFormLabel>Teléfono</CFormLabel>
                                <CFormInput
                                    type="text"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Documento</CFormLabel>
                                <CFormInput
                                    type="text"
                                    value={documento}
                                    onChange={(e) => setDocumento(e.target.value)}
                                />
                            </div>

                            <CButton type="submit" color="primary" onClick={handleGuardarCliente}>
                                Guardar Cliente
                            </CButton>
                            <Link to="/clientes/listaClientes">
                                <CButton type="button" color="secondary">
                                    Cancelar
                                </CButton>
                            </Link>
                        </form>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
}

export default CrearCliente;
