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
} from '@coreui/react';
import InsumoService from 'src/views/services/insumoService';

function CrearInsumo() {
    const [nombre, setNombre] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precio, setPrecio] = useState('');

    const [nombreError, setNombreError] = useState('');
    const [cantidadError, setCantidadError] = useState('');
    const [precioError, setPrecioError] = useState('');

    const navigate = useNavigate(); // Utiliza useNavigate para la redirección

    const fetchInsumos = async () => {
        try {
            const data = await InsumoService.getAllInsumos();
            console.log('Insumos obtenidos:', data.Insumos);
        } catch (error) {
            console.log('Error al obtener insumos:', error);
        }
    };

    useEffect(() => {
        fetchInsumos();
    }, []);

    const validateNombre = (value) => {
        
        if (!/^[a-zA-Z ñÑ]{2,}$/.test(value)) {
            setNombreError('Nombre deben contener solo letras y tener al menos 2 caracteres.');
            return false;
        }
        setNombreError('');
        return true;
    };

    const validateCantidad = (value) => {
        
        if (!/^\d+$/.test(value)) {
            setCantidadError('La cantidad debe contener solo números.');
            return false;
        }
        setCantidadError('');
        return true;
    };

    const validatePrecio = (value) => {
        
        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            setPrecioError('El precio no es válido.');
            return false;
        }
        setPrecioError('');
        return true;
    };

    const handleGuardarInsumo = async (e) => {
        e.preventDefault();

        if (!validateNombre(nombre) || !validateCantidad(cantidad) || !validatePrecio(precio)) {
            return;
        }

        const newInsumo = {
            nombre,
            cantidad,
            precio,
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8095/api/insumo', newInsumo, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Insumo creado:', response.data);

            setNombre('');
            setCantidad('');
            setPrecio('');

            Swal.fire('Éxito', 'Insumo creado correctamente.', 'success').then(() => {
                navigate('/Insumos'); // Utiliza navigate para la redirección
            });
        } catch (error) {
            console.error('Error al crear el insumo:', error);
            Swal.fire('Error', 'Hubo un problema al crear el insumo.', 'error');
        }
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardHeader>
                        <strong>Crear Insumo</strong>
                    </CCardHeader>
                    <CCardBody>
                        <form onSubmit={handleGuardarInsumo}>
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
                                <CFormLabel>Cantidad</CFormLabel>
                                <CFormInput
                                    type="text"
                                    value={cantidad}
                                    onChange={(e) => {
                                        setCantidad(e.target.value);
                                        validateCantidad(e.target.value);
                                    }}
                                />
                                {cantidadError && <div className="text-danger">{cantidadError}</div>}
                            </div>

                            <div className="mb-3">
                                <CFormLabel>Precio</CFormLabel>
                                <CFormInput
                                    type="text"
                                    value={precio}
                                    onChange={(e) => {
                                        setPrecio(e.target.value);
                                        validatePrecio(e.target.value);
                                    }}
                                />
                                {precioError && <div className="text-danger">{precioError}</div>}
                            </div>

                            <CButton type="submit" color="primary">
                                Guardar Insumo
                            </CButton>
                            <Link to="/Insumos">
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

export default CrearInsumo;
