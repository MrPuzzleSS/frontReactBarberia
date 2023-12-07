import React, {useState} from 'react';
import { Link, Navigate } from 'react-router-dom';
import ProveedoresDataService from 'src/views/services/ProveedoresService';
import Swal from 'sweetalert2'
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
import { useForm, Controller } from "react-hook-form";

const CrearProveedor = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      tipo_de_producto_servicio: '',
    }
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
        <CCard className='mb-4'>
          <CCardHeader>
            <strong>Crear Proveedor</strong>
          </CCardHeader>
          <CCardBody>
            <CForm className='row g-3' onSubmit={handleSubmit(onSubmit)}>
              <CCol sm={6}>
                <CFormLabel>Nombre del Proveedor</CFormLabel>
                <Controller
                  name="nombre"
                  control={control}
                  rules={{required: true}}
                  render={({ field }) => <CFormInput {...field} />}
                />
                {errors.nombre?.type === 'required' && <p style={{color: 'red'}}>El nombre del proveedor es requerido</p>}
              </CCol>
              <CCol sm={6}>
                <CFormLabel>Dirección</CFormLabel>
                <Controller
                  name="direccion"
                  control={control}
                  rules={{required: true}}
                  render={({ field }) => <CFormInput {...field} />}
                />
                {errors.direccion?.type === 'required' && <p style={{color: 'red'}}>El campo direccion es requerido</p>}
              </CCol>
              <CCol sm={6}>
                <CFormLabel>Teléfono</CFormLabel>
                <Controller
                  name="telefono"
                  control={control}
                  rules={{required: true}}
                  render={({ field }) => <CFormInput {...field} />}
                />
                {errors.telefono?.type === 'required' && <p style={{color: 'red'}}>El campo telefono es requerido</p>}
              </CCol>
              <CCol sm={6}>
                <CFormLabel>Correo Electrónico</CFormLabel>
                <Controller
                  name="email"
                  control={control}
                  rules={{required: true}}
                  render={({ field }) => <CFormInput {...field} />}
                />
                {errors.email?.type === 'required' && <p style={{color: 'red'}}>El campo correo electrónico es requerido</p>}
              </CCol>
              <CCol sm={6}>
                <CFormLabel>Producto/Servicio</CFormLabel>
                <Controller
                  name="tipo_de_producto_servicio"
                  control={control}
                  rules={{required: true}}
                  render={({ field }) => <CFormInput {...field} />}
                />
                {errors.tipo_de_producto_servicio?.type === 'required' && <p style={{color: 'red'}}>El campo producto o servicio es requerido</p>}
              </CCol>
              <CCol xs={12} >
              <CButton type='submit' color='primary' className="me-md-2">
                Crear Proveedor
              </CButton>
              <Link to='/proveedores/lista-proveedores'>
                <CButton type='button' color='secondary'>
                  Cancelar
                </CButton>
              </Link>
              </CCol>
            </CForm>
            {submitted && (
              <Navigate to='/proveedores/lista-proveedores'/>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default CrearProveedor;
