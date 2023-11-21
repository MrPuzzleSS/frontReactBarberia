/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
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

const CrearProveedor = () => {
  const initialProveedorState = {
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    tipo_de_producto_servicio: '',
  };

  const [proveedor, setProveedor] = useState(initialProveedorState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProveedor({ ...proveedor, [name]: value });
  };

  const saveProveedor = () => {
    ProveedoresDataService.create(proveedor)
      .then((response) => {
        setProveedor(response.data);
        setSubmitted(true);
        console.log(response.data);

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Proveedor Creado Exitosamente",
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch((error) => {
        console.error('Error al crear proveedor:', error);
      });
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className='mb-4'>
          <CCardHeader>
            <strong>Crear Proveedor</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CCol sm={6}>
                <CFormLabel>Nombre del Proveedor</CFormLabel>
                <CFormInput
                  type='text'
                  name='nombre'
                  value={proveedor.nombre}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol sm={6}>
                <CFormLabel>Dirección</CFormLabel>
                <CFormInput
                  type='text'
                  name='direccion'
                  value={proveedor.direccion}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol sm={6}>
                <CFormLabel>Teléfono</CFormLabel>
                <CFormInput
                  type='tel'
                  name='telefono'
                  value={proveedor.telefono}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol sm={6}>
                <CFormLabel>Correo Electrónico</CFormLabel>
                <CFormInput
                  type='email'
                  name='email'
                  value={proveedor.email}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol sm={6}>
                <CFormLabel>Producto/Servicio</CFormLabel>
                <CFormInput
                  type='text'
                  name='tipo_de_producto_servicio'
                  value={proveedor.tipo_de_producto_servicio}
                  onChange={handleInputChange}
                />
              </CCol>
              <CButton type='button' color='primary' onClick={saveProveedor} to='/proveedores/lista-proveedores'>
                Crear Proveedor
              </CButton>
              <Link to='/proveedores/lista-proveedores'>
                <CButton type='button' color='secondary'>
                  Cancelar
                </CButton>
              </Link>
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
