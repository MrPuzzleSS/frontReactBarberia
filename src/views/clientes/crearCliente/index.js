import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '@sweetalert2/theme-bootstrap-4/bootstrap-4.css';
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
        setErrors({
            ...errors,
            [name]: null,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setSaving(true);

        const validationErrors = {};

        // Validaciones...

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSaving(false);
            return;
        }

        axios
            .post('/api/crearCliente', formData)
            .then((response) => {
                setSuccess(true);
                setSaving(false);
                Swal.fire({
                    icon: 'success',
                    title: '¡Cliente creado con éxito!',
                    showConfirmButton: false,
                    timer: 1500,
                });
            })
            .catch((error) => {
                setErrors({ general: 'Error al crear el cliente. Inténtalo de nuevo.' });
                setSaving(false);
            });
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
                                <CFormLabel>Nombre... completo</CFormLabel>
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