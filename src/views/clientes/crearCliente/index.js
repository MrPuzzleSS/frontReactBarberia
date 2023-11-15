import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormLabel,
    CFormSelect,
    CFormInput,
    CRow,
} from '@coreui/react';
import axios from 'axios';

function CrearCliente() {
    const initialFormData = {
        nombre: '',
        apellido: '',
        correo: '',
        documento: '',
        telefono: '',
        estado: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Limpiar el error asociado al campo actual al modificar su valor
        setErrors({
            ...errors,
            [name]: null,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({}); // Limpiar errores existentes
        setSaving(true); // Activar indicador de guardado

        // Realizar validación de formulario aquí
        const validationErrors = {};

        // Validar nombre
        if (!formData.nombre) {
            validationErrors.nombre = 'Por favor, ingresa el nombre.';
        }

        // Validar apellido
        if (!formData.apellido) {
            validationErrors.apellido = 'Por favor, ingresa el apellido.';
        }

        // Validar correo
        if (!formData.correo) {
            validationErrors.correo = 'Por favor, ingresa el correo.';
        } else if (!isValidEmail(formData.correo)) {
            validationErrors.correo = 'Por favor, ingresa un correo válido.';
        }

        // Validar documento
        if (!formData.documento) {
            validationErrors.documento = 'Por favor, ingresa el número de documento.';
        } else if (!isValidDocumentNumber(formData.documento)) {
            validationErrors.documento = 'Por favor, ingresa un número de documento válido.';
        }

        // Validar teléfono
        if (!formData.telefono) {
            validationErrors.telefono = 'Por favor, ingresa el número de teléfono.';
        } else if (!isValidPhoneNumber(formData.telefono)) {
            validationErrors.telefono = 'Por favor, ingresa un número de teléfono válido.';
        }

        // Validar estado
        if (!formData.estado) {
            validationErrors.estado = 'Por favor, selecciona el estado.';
        }

        // Verificar si hay errores de validación
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSaving(false); // Desactivar indicador de guardado debido a errores
            return;
        }

        axios
            .post('/api/crear-cliente', formData)
            .then((response) => {
                setSuccess(true);
                setSaving(false); // Desactivar indicador de guardado después de éxito
                // Puedes añadir aquí un código adicional si es necesario
            })
            .catch((error) => {
                setErrors({ general: 'Error al crear el cliente. Inténtalo de nuevo.' });
                setSaving(false); // Desactivar indicador de guardado en caso de error
            });
    };

    const isValidEmail = (email) => {
        // Expresión regular para validar un correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPhoneNumber = (phoneNumber) => {
        // Expresión regular para validar un número de teléfono (solo dígitos, longitud 9-15)
        const phoneRegex = /^\d{9,15}$/;
        return phoneRegex.test(phoneNumber);
    };

    const isValidDocumentNumber = (documentNumber) => {
        // Expresión regular para validar un número de documento (solo dígitos, longitud 1-15)
        const documentRegex = /^\d{1,15}$/;
        return documentRegex.test(documentNumber);
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardHeader>
                        <strong>Crear Cliente</strong>
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
                                <strong>Cliente creado con éxito.</strong>
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <CFormLabel>Nombre</CFormLabel>
                                <CFormInput
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                                {errors.nombre && (
                                    <div className="text-danger">
                                        <small>{errors.nombre}</small>
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Apellido</CFormLabel>
                                <CFormInput
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                />
                                {errors.apellido && (
                                    <div className="text-danger">
                                        <small>{errors.apellido}</small>
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Correo</CFormLabel>
                                <CFormInput
                                    type="email"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                />
                                {errors.correo && (
                                    <div className="text-danger">
                                        <small>{errors.correo}</small>
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Documento</CFormLabel>
                                <CFormInput
                                    type="number"
                                    name="documento"
                                    value={formData.documento}
                                    onChange={handleChange}
                                />
                                {errors.documento && (
                                    <div className="text-danger">
                                        <small>{errors.documento}</small>
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Teléfono</CFormLabel>
                                <CFormInput
                                    type="number"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                />
                                {errors.telefono && (
                                    <div className="text-danger">
                                        <small>{errors.telefono}</small>
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Estado</CFormLabel>
                                <CFormSelect
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
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
