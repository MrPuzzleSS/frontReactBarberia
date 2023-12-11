import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import ClienteService from 'src/views/services/clienteService'; // Update the service if necessary

function CrearCliente() {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [documento, setDocumento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [error, setError] = useState('');

    const handleGuardarCliente = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!nombre.trim() || !apellido.trim() || !documento.trim() || !telefono.trim()) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        // Validación de nombre y apellido: deben contener solo letras y tener al menos 2 caracteres
        if (!/^[a-zA-Z]{2,}$/.test(nombre) || !/^[a-zA-Z]{2,}$/.test(apellido)) {
            setError('Nombre y apellido deben contener solo letras y tener al menos 2 caracteres.');
            return;
        }

        // Validación de documento: debe ser un número positivo
        if (!/^[1-9]\d*$/.test(documento)) {
            setError('El documento no es válido.');
            return;
        }

        // Validación de teléfono: solo permite números y debe tener al menos 7 dígitos
        if (!/^\d{7,}$/.test(telefono)) {
            setError('El teléfono no es válido.');
            return;
        }

        const newCliente = {
            nombre,
            apellido,
            documento,
            telefono,
        };

        try {
            const response = await ClienteService.createCliente(newCliente);
            console.log('Cliente creado:', response);

            setNombre('');
            setApellido('');
            setDocumento('');
            setTelefono('');
            setError('');
        } catch (error) {
            console.error('Error al crear el cliente:', error);
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
                                <CFormLabel>Documento</CFormLabel>
                                <CFormInput
                                    type="number"
                                    value={documento}
                                    onChange={(e) => setDocumento(e.target.value)}
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
                            {/* Mensaje de error */}
                            {error && <div style={{ color: 'red' }}>{error}</div>}
                            <CButton type="submit" color="primary" className="mr-2">
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
