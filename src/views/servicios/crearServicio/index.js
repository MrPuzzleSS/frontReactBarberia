import React, { useState } from 'react';
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
import ServicioService from 'src/views/services/servicioService';

function CrearServicio() {
    const [nombre, setNombre] = useState('');
    const [valor, setValor] = useState(0);
    const [error, setError] = useState('');

    const handleGuardarServicio = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!nombre.trim() || valor <= 0) {
            setError('El nombre es obligatorio y el valor debe ser mayor que cero.');
            return;
        }

        const newServicio = {
            nombre,
            valor,
        };

        try {
            const response = await ServicioService.createServicio(newServicio);
            console.log('Servicio creado:', response);

            setNombre('');
            setValor(0);
            setError('');
        } catch (error) {
            console.error('Error al crear el servicio:', error);
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
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Valor</CFormLabel>
                                <CFormInput
                                    type="number"
                                    value={valor}
                                    onChange={(e) => setValor(e.target.value)}
                                />
                            </div>
                            {/* Mensaje de error */}
                            {error && <div style={{ color: 'red' }}>{error}</div>}
                            <CButton type="submit" color="primary" className="mr-2">
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
