import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import ProveedoresDataService from 'src/views/services/ProveedoresService';
import Swal from 'sweetalert2';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
} from '@coreui/react';
import { useForm, Controller } from 'react-hook-form';

const CrearProveedor = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipo_documento: '',
      num_documento: '',
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
    },
  });

  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const onSubmit = async (data) => {
    console.log(data);
    try {
      const { nombre, email, num_documento } = data;
      const { nombreExists, emailExists, documentoExist } = await ProveedoresDataService.checkExistence(nombre, email, num_documento);
      
      if (documentoExist) {
        setValidationError('El número de documento ya existe');
        return;
      }

      if (nombreExists) {
        setValidationError('El nombre del proveedor ya existe');
        return;
      }

      if (emailExists) {
        setValidationError('El correo electrónico ya está en uso');
        return;
      }

      // Convertir el objeto a JSON
      const jsonData = JSON.stringify(data);

      // Llamada a la función create del servicio con la cadena JSON
      await ProveedoresDataService.create(jsonData);
      setSubmitted(true);
      // Mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Proveedor creado con éxito',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      // Manejo de errores, mostrar mensaje de error, etc.
      console.error('Error al crear el proveedor', error);
    }
  };

  return (
    <CRow>
      <CCol xs>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Crear Proveedor</strong>
          </CCardHeader>
          <CCardBody>
          {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
            <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
              <CCol sm={6}>
                <CFormLabel>Tipo de Documento</CFormLabel>
                <Controller
                  name="tipo_documento"
                  control={control}
                  rules={{
                    required: 'El tipo de documento es requerido',
                  }}
                  render={({ field }) => (
                    <CFormSelect {...field} className="form-select">
                      <option value="">Seleccione un tipo de documento</option>
                      <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                      <option value="Cédula de Extranjería">Cédula de Extranjería</option>
                      <option value="NIT">NIT</option>
                    </CFormSelect>
                  )}
                />
                {errors.tipo_documento && (
                  <p style={{ color: 'red' }}>{errors.tipo_documento.message}</p>
                )}
              </CCol>
              <CCol sm={6}>
                <CFormLabel>Número de Documento</CFormLabel>
                <Controller
                  name="num_documento"
                  control={control}
                  rules={{
                    required: 'El número de documento es requerido',
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'El número de documento debe contener solo números',
                    },
                    minLength: {
                      value: 5,
                      message: 'El número de documento debe de tener un minimo de 5 caracteres'
                    },
                    maxLength: {
                      value: 15,
                      message: 'El número de documento no puede tener más de 15 caracteres',
                    },
                  }}
                  render={({ field }) => <CFormInput maxLength={15}{...field} />}
                />
                {errors.num_documento && (
                  <p style={{ color: 'red' }}>{errors.num_documento.message}</p>
                )}
              </CCol>
              <CCol sm={6}>
                <CFormLabel>Nombre del Proveedor</CFormLabel>
                <Controller
                  name="nombre"
                  control={control}
                  rules={{
                    required: 'El nombre del proveedor es requerido',
                    maxLength: {
                      value: 20,
                      message: 'El nombre no puede tener más de 15 caracteres',
                    },
                    minLength: {
                      value: 5,
                      message: 'El nombre debe de tener un minimo de 5 caracteres'
                    },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: 'El nombre debe contener solo letras',
                    }
                  }}
                  render={({ field }) => <CFormInput {...field} />}
                />
                {errors.nombre && (
                  <p style={{ color: 'red' }}>{errors.nombre.message}</p>
                )}
              </CCol>
              <CCol sm={6}>
                <CFormLabel>Dirección</CFormLabel>
                <Controller
                  name="direccion"
                  control={control}
                  rules={{
                    required: 'La dirección es requerida',
                    maxLength: {
                      value: 255,
                      message: 'La dirección no puede tener más de 255 caracteres',
                    },
                    minLength: {
                      value: 5,
                      message: 'La dirección debe de tener un minimo de 5 caracteres'
                    }
                  }}
                  render={({ field }) => <CFormInput {...field} />}
                />
                {errors.direccion && (
                  <p style={{ color: 'red' }}>{errors.direccion.message}</p>
                )}
              </CCol>
              <CCol sm={6}>
                <CFormLabel>Teléfono</CFormLabel>
                <Controller
                  name="telefono"
                  control={control}
                  rules={{
                    required: 'El teléfono es requerido',
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'El teléfono debe contener solo números',
                    },
                    minLength: {
                      value: 10,
                      message: 'El telefono debe de tener un minimo de 10 digitos'
                    },
                    maxLength: {
                      value: 10,
                      message: 'El telefono no puede tener más de 10 digitos',
                    },
                  }}
                  render={({ field }) => <CFormInput placeholder='32030432032' type='tel' maxLength={10} {...field} />}
                />
                {errors.telefono && (
                  <p style={{ color: 'red' }}>{errors.telefono.message}</p>
                )}
              </CCol>
              <CCol sm={6}>
                <CFormLabel>Correo Electrónico</CFormLabel>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'El correo electrónico es requerido',
                    pattern: {
                      // eslint-disable-next-line no-useless-escape
                      value: /^[A-Z0-9]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: 'Ingrese un correo electrónico válido',
                    },
                  }}
                  render={({ field }) => <CFormInput {...field} />}
                />
                {errors.email && (
                  <p style={{ color: 'red' }}>{errors.email.message}</p>
                )}
              </CCol>
              <CCol xs={12}>
                <CButton type="submit" color="primary" className="me-md-2">
                  Crear Proveedor
                </CButton>
                <Link to="/proveedores/lista-proveedores">
                  <CButton type="button" color="secondary">
                    Cancelar
                  </CButton>
                </Link>
              </CCol>
            </CForm>
            {submitted && <Navigate to="/proveedores/lista-proveedores" />}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default CrearProveedor;
