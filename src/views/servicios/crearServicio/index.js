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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function CrearServicio() {
    const [nombre, setNombre] = useState('');
    const [valor, setValor] = useState('');
    const [tiempo, setTiempo] = useState('');

    const [nombreError, setNombreError] = useState('');
    const [valorError, setValorError] = useState('');
    const [tiempoError, setTiempoError] = useState('');

    const navigate = useNavigate(); // Utiliza useNavigate en lugar de useHistory

    useEffect(() => {
        fetchServicios();
    }, []);

    const fetchServicios = async () => {
        try {
            const data = await ServicioService.getAllServicios();
            console.log('Servicios obtenidos:', data.Servicios);
        } catch (error) {
            console.log('Error al obtener servicios:', error);
        }
    };

    const validateNombre = (value) => {
        if (!/^[a-zA-Z ñÑ]{2,}$/.test(value)) {
            setNombreError('Nombre debe contener solo letras y tener al menos 2 caracteres.');
            return false;
        }
        setNombreError('');
        return true;
    };

    const nombreCapitalizado = capitalizeFirstLetter(nombre);


    const validateValor = (value) => {
        if (!/^\d{3,}$/.test(value)) {
            setValorError('El valor debe contener solo números y tener al menos 3 caracteres.');
            return false;
        }
        setValorError('');
        return true;
    };

    const validateTiempo = (value) => {
        if (!/^\d+$/.test(value)) {
            setTiempoError('El tiempo debe ser un número entero positivo.');
            return false;
        }
        setTiempoError('');
        return true;
    };

    const handleGuardarServicio = async (e) => {
        e.preventDefault();

        if (!validateNombre(nombre) || !validateValor(valor) || !validateTiempo(tiempo)) {
            return;
        }

        const newServicio = {
            nombre: nombreCapitalizado,
            valor,
            tiempo,
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
            setTiempo('');

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
                            <div className="mb-3 row">
                                <div className="col-md-4">
                                    <CFormLabel style={{ fontWeight: 'bold' }}>Nombre</CFormLabel>
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
                                <div className="col-md-4">
                                    <CFormLabel style={{ fontWeight: 'bold' }}>Valor</CFormLabel>
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
                            </div>
                            <div className="mb-3 col-md-3">
                                <CFormLabel style={{ fontWeight: 'bold' }}>Tiempo (minutos)</CFormLabel>
                                <CFormInput
                                    type="number"
                                    value={tiempo}
                                    onChange={(e) => {
                                        setTiempo(e.target.value);
                                        validateTiempo(e.target.value);
                                    }}
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                />
                                {tiempoError && <div className="text-danger">{tiempoError}</div>}
                            </div>

                            <br />

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
