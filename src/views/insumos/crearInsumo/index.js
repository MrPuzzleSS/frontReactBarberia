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
import InsumoService from 'src/views/services/insumoService'; // Actualiza el servicio si es necesario

function CrearInsumo() {
    const [nombre, setNombre] = useState('');
    const [stock, setStock] = useState(0);
    const [precio, setPrecio] = useState(0);
    const [error, setError] = useState('');

    const handleGuardarInsumo = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!nombre.trim() || stock <= 0 || precio <= 0) {
            setError('Todos los campos son obligatorios y los valores numéricos deben ser mayores que cero.');
            return;
        }

        const newInsumo = {
            nombre,
            stock,
            precio,
        };

        try {
            const response = await InsumoService.createInsumo(newInsumo);
            console.log('Insumo creado:', response);

            setNombre('');
            setStock(0);
            setPrecio(0);
            setError('');
        } catch (error) {
            console.error('Error al crear el insumo:', error);
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
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Stock</CFormLabel>
                                <CFormInput
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Precio</CFormLabel>
                                <CFormInput
                                    type="number"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                />
                            </div>
                            {/* Mensaje de error */}
                            {error && <div style={{ color: 'red' }}>{error}</div>}
                            <CButton type="submit" color="primary" className="mr-2">
                                Guardar Insumo
                            </CButton>
                            <Link to="/insumos/listaInsumos">
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
