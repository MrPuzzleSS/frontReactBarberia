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

function CrearServicio() {
    const [servicio, setServicio] = useState({
        id: '',
        nombre: '',
        valor: 0,
        estado: '',
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setServicio({
            ...servicio,
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

        // Validar ID del Servicio
        if (!servicio.id) {
            validationErrors.id = 'Por favor, ingresa el ID del servicio.';
        }

        // Validar Nombre del Servicio
        if (!servicio.nombre) {
            validationErrors.nombre = 'Por favor, ingresa el nombre del servicio.';
        }

        // Validar Valor del Servicio
        if (!servicio.valor || servicio.valor <= 0) {
            validationErrors.valor = 'Por favor, ingresa un valor válido para el servicio.';
        }

        // Validar Estado
        if (!servicio.estado) {
            validationErrors.estado = 'Por favor, selecciona el estado del servicio.';
        }

        // Verificar si hay errores de validación
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSaving(false); // Desactivar indicador de guardado debido a errores
            return;
        }

        // Aquí puedes realizar la lógica para guardar el servicio en la base de datos
        // Por ejemplo, puedes enviar una solicitud a tu API para crear el servicio
        // console.log('Servicio creado:', servicio);

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
                        <strong>Crear Servicio</strong>
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
                                <strong>Servicio creado con éxito.</strong>
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <CFormLabel>ID del Servicio</CFormLabel>
                                <CFormInput
                                    type="text"
                                    name="id"
                                    value={servicio.id}
                                    onChange={handleInputChange}
                                />
                                {errors.id && (
                                    <div className="text-danger">
                                        <small>{errors.id}</small>
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Nombre del Servicio</CFormLabel>
                                <CFormInput
                                    type="text"
                                    name="nombre"
                                    value={servicio.nombre}
                                    onChange={handleInputChange}
                                />
                                {errors.nombre && (
                                    <div className="text-danger">
                                        <small>{errors.nombre}</small>
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Valor del Servicio</CFormLabel>
                                <CFormInput
                                    type="number"
                                    name="valor"
                                    value={servicio.valor}
                                    onChange={handleInputChange}
                                />
                                {errors.valor && (
                                    <div className="text-danger">
                                        <small>{errors.valor}</small>
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Estado</CFormLabel>
                                <CFormSelect
                                    name="estado"
                                    value={servicio.estado}
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
