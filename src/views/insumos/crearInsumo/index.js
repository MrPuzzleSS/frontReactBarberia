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
    CFormSelect,
    CRow,
} from '@coreui/react';

function CrearInsumo() {
    const [insumo, setInsumo] = useState({
        id: '',
        nombre: '',
        valor: 0,
        cantidad: 0,
        estado: '',
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInsumo({
            ...insumo,
            [name]: value,
        });

        // Limpiar el error asociado al campo actual al modificar su valor
        setErrors({
            ...errors,
            [name]: null,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors({}); // Limpiar errores existentes
        setSaving(true); // Activar indicador de guardado

        // Realizar validación de formulario aquí
        const validationErrors = {};

        // Validar ID del Insumo
        if (!insumo.id) {
            validationErrors.id = 'Por favor, ingresa el ID del insumo.';
        }

        // Validar Nombre del Insumo
        if (!insumo.nombre) {
            validationErrors.nombre = 'Por favor, ingresa el nombre del insumo.';
        }

        // Validar Valor del Insumo
        if (!insumo.valor || insumo.valor <= 0) {
            validationErrors.valor = 'Por favor, ingresa un valor válido para el insumo.';
        }

        // Validar Cantidad del Insumo
        if (!insumo.cantidad || insumo.cantidad <= 0) {
            validationErrors.cantidad = 'Por favor, ingresa una cantidad válida para el insumo.';
        }

        // Validar Estado
        if (!insumo.estado) {
            validationErrors.estado = 'Por favor, selecciona el estado del insumo.';
        }

        // Verificar si hay errores de validación
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSaving(false); // Desactivar indicador de guardado debido a errores
            return;
        }

        // Aquí puedes realizar la lógica para guardar el insumo en la base de datos
        // Por ejemplo, puedes enviar una solicitud a tu API para crear el insumo
        // console.log('Insumo creado:', insumo);

        // Simulando una solicitud asíncrona (puedes reemplazar esto con tu lógica real)
        setTimeout(() => {
            setSuccess(true);
            setSaving(false); // Desactivar indicador de guardado después de éxito
        }, 1000);
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardHeader>
                        <strong>Crear Insumo</strong>
                    </CCardHeader>
                    <CCardBody>
                        {saving && (
                            <div className="text-info mb-3">
                                <strong>Guardando...</strong>
                            </div>
                        )}
                        {errors.general && (
                            <div className="text-danger mb-3">
                                <strong>{errors.general}</strong>
                            </div>
                        )}
                        {success && (
                            <div className="text-success mb-3">
                                <strong>Insumo creado con éxito.</strong>
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <CFormLabel>ID del Insumo</CFormLabel>
                                <CFormInput
                                    type="text"
                                    name="id"
                                    value={insumo.id}
                                    onChange={handleInputChange}
                                />
                                {errors.id && (
                                    <div className="text-danger">
                                        <small>{errors.id}</small>
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Nombre del Insumo</CFormLabel>
                                <CFormInput
                                    type="text"
                                    name="nombre"
                                    value={insumo.nombre}
                                    onChange={handleInputChange}
                                />
                                {errors.nombre && (
                                    <div className="text-danger">
                                        <small>{errors.nombre}</small>
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Valor del Insumo</CFormLabel>
                                <CFormInput
                                    type="number"
                                    name="valor"
                                    value={insumo.valor}
                                    onChange={handleInputChange}
                                />
                                {errors.valor && (
                                    <div className="text-danger">
                                        <small>{errors.valor}</small>
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Cantidad del Insumo</CFormLabel>
                                <CFormInput
                                    type="number"
                                    name="cantidad"
                                    value={insumo.cantidad}
                                    onChange={handleInputChange}
                                />
                                {errors.cantidad && (
                                    <div className="text-danger">
                                        <small>{errors.cantidad}</small>
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Estado</CFormLabel>
                                <CFormSelect
                                    name="estado"
                                    value={insumo.estado}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Selecciona el estado</option>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </CFormSelect>
                                {errors.estado && (
                                    <div className="text-danger">
                                        <small>{errors.estado}</small>
                                    </div>
                                )}
                            </div>
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
