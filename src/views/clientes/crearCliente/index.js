import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    const [documento, setDocumento] = useState('');

    const [errorNombre, setErrorNombre] = useState('');
    const [errorApellido, setErrorApellido] = useState('');
    const [errorCorreo, setErrorCorreo] = useState('');
    const [errorTelefono, setErrorTelefono] = useState('');
    const [errorDocumento, setErrorDocumento] = useState('');

    const navigate = useNavigate();

    const fetchClientes = async () => {
        try {
            const data = await ClienteService.getAllClientes();
            console.log('Clientes obtenidos:', data.Clientes);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const validateNombre = (value) => {
        if (!/^[a-zA-Z ñÑ]{2,}$/.test(value)) {
            setErrorNombre('Nombre debe contener solo letras y tener al menos 2 caracteres.');
            return false;
        }
        setErrorNombre('');
        return true;
    };

    const validateApellido = (value) => {
        if (!/^[a-zA-Z ñÑ]{2,}$/.test(value)) {
            setErrorApellido('Apellido debe contener solo letras y tener al menos 2 caracteres.');
            return false;
        }
        setErrorApellido('');
        return true;
    };

    const validateCorreo = (value) => {
        if (!/^\S+@\S+\.\S+$/.test(value)) {
            setErrorCorreo('El correo electrónico no es válido.');
            return false;
        }
        setErrorCorreo('');
        return true;
    };

    const validateTelefono = (value) => {
        if (!/^\d{7,}$/.test(value)) {
            setErrorTelefono('El teléfono no es válido.');
            return false;
        }
        setErrorTelefono('');
        return true;
    };

    const validateDocumento = (value) => {
        if (!/^\d+$/.test(value)) {
            setErrorDocumento('El documento debe contener solo números.');
            return false;
        }
        setErrorDocumento('');
        return true;
    };

    const handleGuardarCliente = async (e) => {
        e.preventDefault();

        if (!validateNombre(nombre) || !validateApellido(apellido) || !validateCorreo(correo) ||
            !validateTelefono(telefono) || !validateDocumento(documento)) {
            return;
        }

        const newCliente = {
            nombre,
            apellido,
            correo,
            telefono,
            documento,
        };

        try {
            const response = await ClienteService.createCliente(newCliente);
            console.log('Cliente creado:', response.data);

            setNombre('');
            setApellido('');
            setCorreo('');
            setTelefono('');
            setDocumento('');

            Swal.fire('Éxito', 'Cliente creado correctamente.', 'success').then(() => {
                navigate('/clientes/listaClientes');
            });
        } catch (error) {
            console.error('Error al crear el cliente:', error);

            Swal.fire('Error', 'Hubo un problema al crear el cliente. Por favor, inténtalo de nuevo.', 'error');
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
                                <div className="text-danger">{errorNombre}</div>
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Apellido</CFormLabel>
                                <CFormInput
                                    type="text"
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                />
                                <div className="text-danger">{errorApellido}</div>
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Correo</CFormLabel>
                                <CFormInput
                                    type="email"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                />
                                <div className="text-danger">{errorCorreo}</div>
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Teléfono</CFormLabel>
                                <CFormInput
                                    type="text"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                />
                                <div className="text-danger">{errorTelefono}</div>
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Documento</CFormLabel>
                                <CFormInput
                                    type="text"
                                    value={documento}
                                    onChange={(e) => setDocumento(e.target.value)}
                                />
                                <div className="text-danger">{errorDocumento}</div>
                            </div>
                            <CButton type="submit" color="primary">
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
