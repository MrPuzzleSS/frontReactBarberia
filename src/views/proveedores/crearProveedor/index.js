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
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      tipo_de_producto_servicio: '',
    },
  });

  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data) => {
    console.log(data);
    try {
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
            <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
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
                      message: 'El telefono debe de tener un minimo de 10 caracteres'
                    }
                  }}
                  render={({ field }) => <CFormInput {...field} />}
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
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: 'Ingrese un correo electrónico válido',
                    },
                  }}
                  render={({ field }) => <CFormInput {...field} />}
                />
                {errors.email && (
                  <p style={{ color: 'red' }}>{errors.email.message}</p>
                )}
              </CCol>
              <CCol sm={6}>
                <CFormLabel>Producto/Servicio</CFormLabel>
                <Controller
                  name="tipo_de_producto_servicio"
                  control={control}
                  rules={{
                    required: 'El campo producto o servicio es requerido',
                    maxLength: {
                      value: 20,
                      message: 'El campo producto o servicio no puede tener más de 20 caracteres',
                    },
                    minLength: {
                      value: 5,
                      message: 'El campo producto o servicio  debe de tener un minimo de 5 caracteres'
                    }
                  }}
                  render={({ field }) => <CFormInput {...field} />}
                />
                {errors.tipo_de_producto_servicio && (
                  <p style={{ color: 'red' }}>{errors.tipo_de_producto_servicio.message}</p>
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
