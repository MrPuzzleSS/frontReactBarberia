import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    CDropdown, // Importar CDropdown
    CDropdownToggle, // Importar CDropdownToggle
    CDropdownMenu, // Importar CDropdownMenu
    CDropdownItem, // Importar CDropdownItem
} from '@coreui/react';
import ServicioService from 'src/views/services/servicioService';

function CrearServicio() {
    const [nombre, setNombre] = useState('');
    const [valor, setValor] = useState('');
    const [tiempoEstimado, setTiempoEstimado] = useState('');
    const [servicios, setServicios] = useState([]);

    const [nombreError, setNombreError] = useState('');
    const [valorError, setValorError] = useState('');

    const navigate = useNavigate();

    const fetchServicios = async () => {
        try {
            const response = await ServicioService.getAllServicios();
            setServicios(response.data.Servicios);
        } catch (error) {
            console.error('Error al obtener servicios:', error);
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
            tiempoEstimado,
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8095/api/servicio', newServicio, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Servicio creado:', response.data);

            setNombre('');
            setValor('');
            setTiempoEstimado('');

            Swal.fire('Éxito', 'Servicio creado correctamente.', 'success').then(() => {
                navigate('/servicios/listaServicios');
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
                            <div className="mb-3">
                                <CDropdown className="d-inline-block">
                                    <CDropdownToggle color="secondary">
                                        {tiempoEstimado ? `${tiempoEstimado} minutos` : 'Seleccione el tiempo'}
                                    </CDropdownToggle>
                                    <CDropdownMenu>
                                        {servicios.map(servicio => (
                                            <CDropdownItem
                                                key={servicio.id}
                                                onClick={() => setTiempoEstimado(servicio.tiempoEstimado)}
                                            >
                                                {servicio.nombre} - {servicio.tiempoEstimado} minutos
                                            </CDropdownItem>
                                        ))}
                                    </CDropdownMenu>
                                </CDropdown>
                                {tiempoEstimado && (
                                    <div className="mt-2">Tiempo seleccionado: {tiempoEstimado} minutos</div>
                                )}
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
