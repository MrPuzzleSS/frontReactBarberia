import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate
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
import ServicioService from 'src/views/services/servicioService';

function CrearServicio() {
    const [nombre, setNombre] = useState('');
    const [valor, setValor] = useState('');

    const [nombreError, setNombreError] = useState('');
    const [valorError, setValorError] = useState('');

    const navigate = useNavigate(); // Utiliza useNavigate en lugar de useHistory

    const fetchServicios = async () => {
        try {
            const data = await ServicioService.getAllServicios();
            console.log('Servicios obtenidos:', data.Servicios);
        } catch (error) {
            console.log('Error al obtener servicios:', error);
        }
    };

    useEffect(() => {
        fetchServicios();
    }, []);

    const validateNombre = (value) => {
        if (!/^[a-zA-Z ñÑ]{2,}$/.test(value)) {
            setNombreError('Nombre debe contener solo letras y tener al menos 2 caracteres.');
            return false;
        }
        setNombreError('');
        return true;
    };

    const validateValor = (value) => {
        
        if (!/^\d{3,}$/.test(value)) {
            setValorError('El valor debe contener solo números y tener al menos 3 caracteres.');
            return false;
        }
        setValorError('');
        return true;
    };

    const handleGuardarServicio = async (e) => {
        e.preventDefault();

        if (!validateNombre(nombre) || !validateValor(valor)) {
            return;
        }

        const newServicio = {
            nombre,
            valor,
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://restapibarberia.onrender.com/api/servicio', newServicio, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Servicio creado:', response.data);

            setNombre('');
            setValor('');

            Swal.fire('Éxito', 'Servicio creado correctamente.', 'success').then(() => {
                navigate('/servicios/listaServicios'); // Utiliza navigate en lugar de history.push
            });
        } catch (error) {
            console.error('Error al crear el servicio:', error);
            Swal.fire('Error', 'Hubo un problema al crear el servicio.', 'error');
        }
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardHeader>
                        <strong>Crear Servicio</strong>
                    </CCardHeader>
                    <CCardBody>
                        <form onSubmit={handleGuardarServicio}>
                            <div className="mb-3">
                                <CFormLabel>Nombre</CFormLabel>
                                <CFormInput
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => {
                                        setNombre(e.target.value);
                                        validateNombre(e.target.value);
                                    }}
                                />
                                {nombreError && <div className="text-danger">{nombreError}</div>}
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Valor</CFormLabel>
                                <CFormInput
                                    type="text"
                                    value={valor}
                                    onChange={(e) => {
                                        setValor(e.target.value);
                                        validateValor(e.target.value);
                                    }}
                                />
                                {valorError && <div className="text-danger">{valorError}</div>}
                            </div>

                            <CButton type="submit" color="primary">
                                Guardar Servicio
                            </CButton>
                            <Link to="/servicios/listaServicios">
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

export default CrearServicio;
