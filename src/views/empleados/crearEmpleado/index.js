import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormLabel,
    CFormSelect,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
    CFormFeedback,
} from '@coreui/react';
import EmpleadoService from 'src/views/services/empleadoService';

function CrearEmpleado() {

    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [documento, setDocumento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [estado, setEstado] = useState('');
    const [documentoApi, setdocumentoApi] = useState('');
    const [errorDocumento, setError] = useState(false);

    const [empleados, setEmpleados] = useState([]);


    const validardocumento = async () => {
        setError(false)
        if (documento.length > 0) {
            try {
                const token = localStorage.getItem('token');
                if (!token){
                    console.error('No hay token disponible');
                    return;
                }
    
                const respuesta = await fetch(`http://localhost:8095/api/validar?documento=${documento}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                const datosRespuesta = await respuesta.json();
                if (datosRespuesta.documento == 'El documento ya existe') {
                    setError(true);
                }
                setdocumentoApi(datosRespuesta.documento);
            } catch (error) {
                console.error(error)
            }
        }
    };
    


    //Estados para manejar mensajes de error
    const [nombreError, setNombreError] = useState('');
    const [apellidoError, setApellidoError] = useState('');
    const [correoError, setCorreoError] = useState('');
    const [documentoError, setDocumentoError] = useState('');
    const [telefonoError, setTelefonoError] = useState('');

    const handleGuardarEmpleado = async (e) => {
        e.preventDefault();


        // Limpia mensajes de error
        setNombreError('');
        setApellidoError('');
        setCorreoError('');
        setDocumentoError('');
        setTelefonoError('');


        if (!nombre || !apellido || !correo || !documento || !telefono) {
            Swal.fire('Error', 'Por favor, complete todos los campos', 'error');
            return;
        }

        // Validar el nombre con la expresión regular
        if (!/^[A-Za-z ]+$/.test(nombre)) {
            setNombreError('El nombre debe contener solo letras');
            return;
        }

        if (!/^[A-Za-z ]+$/.test(apellido)) {
            setApellidoError('El apellido debe de contener solo letras');
            return;
        }

        if (!/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(correo)) {
            setCorreoError('Ingrese por favor un correo valido');
            return;
        }

        if (!/^\d{1,10}$/.test(documento)) {
            setDocumentoError('Ingresa solo números y solo se ingresan menos de 10 dígitos');
            return;
        }

        if (!/^\d{1,10}$/.test(telefono)) {
            setTelefonoError('Ingresa solo números y solo se ingresan menos de 10 dígitos');
            return;
        }

        const newEmpleado = {
            nombre,
            apellido,
            correo,
            documento,
            telefono,
            estado,
        };

        try {
            const response = await EmpleadoService.createEmpleado(newEmpleado);
            console.log('Empleado creado:', response);

            setEmpleados([...empleados, response]);

            // Utiliza el método navigate para redireccionar
            navigate('/empleados/listaEmpleados');

            setNombre('');
            setApellido('');
            setCorreo('');
            setDocumento('');
            setTelefono('');

        } catch (error) {
            console.error('Error al crear el empleado:', error);
        }
    };
    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardHeader>
                        <strong>Crear</strong>
                    </CCardHeader>
                    <CCardBody>
                        <form onSubmit={handleGuardarEmpleado}>
                            <div className="mb-3">
                                <CFormLabel>Documento</CFormLabel>
                                <CFormInput
                                    type="number"
                                    value={documento}
                                    onChange={(e) => {
                                        setDocumento(e.target.value);
                                    }}
                                    onBlur={validardocumento}
                                    invalid={documentoError !== ''}
                                />
                                <CFormFeedback invalid>{documentoError}</CFormFeedback>
                            </div>
                            {errorDocumento &&
                                <p style={{ color: 'red' }}>Ya existe un empleado con éste número de cédula</p>
                            }
                            <div className="mb-3">
                                <CFormLabel>Nombre</CFormLabel>
                                <CFormInput
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    invalid={nombreError !== ''}
                                />
                                <CFormFeedback invalid>{nombreError}</CFormFeedback>
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Apellido</CFormLabel>
                                <CFormInput
                                    type='text'
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                    invalid={apellidoError !== ''}
                                />
                                <CFormFeedback invalid>{apellidoError}</CFormFeedback>
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Correo</CFormLabel>
                                <CFormInput
                                    type="email"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    invalid={correoError !== ''}
                                />
                                <CFormFeedback invalid>{correoError}</CFormFeedback>
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Teléfono</CFormLabel>
                                <CFormInput
                                    type='number'
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    invalid={telefonoError !== ''}
                                />
                                <CFormFeedback invalid>{telefonoError}</CFormFeedback>
                            </div>

                            <CButton type="submit" color="primary" className="mr-2">
                                Guardar Empleado
                            </CButton>
                            <Link to="/empleados/listaEmpleados">
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

export default CrearEmpleado