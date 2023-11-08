/* eslint-disable prettier/prettier */
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
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';

function CrearCompra() {
  const [proveedor, setProveedor] = useState('');
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [total, setTotal] = useState('');
  const [fechaCompra] = useState(new Date().toLocaleDateString());

  const calcularTotal = () => {
    const cantidadValue = parseInt(cantidad, 10); // Convierte a número entero
    const precioUnitarioValue = parseFloat(precioUnitario); // Convierte a número decimal

    if (!isNaN(cantidadValue) && !isNaN(precioUnitarioValue)) {
      const totalValue = cantidadValue * precioUnitarioValue;
      setTotal(totalValue.toFixed(2)); // Formatea a 2 decimales
    } else {
      setTotal('');
    }
  };

  const handleCantidadBlur = () => {
    if (cantidad === '') {
      setTotal('');
    } else {
      calcularTotal();
    }
  };

  const handlePrecioUnitarioBlur = () => {
    if (precioUnitario === '') {
      setTotal('');
    } else {
      calcularTotal();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Realizar validaciones antes de guardar
    if (!proveedor || !producto || isNaN(cantidad) || isNaN(precioUnitario)) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    // Aquí puedes manejar los datos ingresados por el usuario, por ejemplo, enviarlos al servidor.

    // Limpia los campos después de guardar
    setProveedor('');
    setProducto('');
    setCantidad('');
    setPrecioUnitario('');
    setTotal('');
  };

  const handleCancelar = () => {
    // Limpia los campos al hacer clic en Cancelar
    setProveedor('');
    setProducto('');
    setCantidad('');
    setPrecioUnitario('');
    setTotal('');
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Crear Compra</strong>
          </CCardHeader>
          <CCardBody>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel>Proveedor</CFormLabel>
                <CFormSelect
                  value={proveedor}
                  onChange={(e) => setProveedor(e.target.value)}
                >
                  <option value="">Seleccionar proveedor</option>
                  {/* Agrega opciones de proveedores aquí */}
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel>Producto</CFormLabel>
                <CFormInput
                  type="text"
                  value={producto}
                  onChange={(e) => setProducto(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Cantidad</CFormLabel>
                <CFormInput
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  onBlur={handleCantidadBlur}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Precio Unitario</CFormLabel>
                <CInputGroup className="mb-3">
                  <CInputGroupText>$</CInputGroupText>
                  <CFormInput
                    type="number"
                    value={precioUnitario}
                    onChange={(e) => setPrecioUnitario(e.target.value)}
                    onBlur={handlePrecioUnitarioBlur}
                  />
                </CInputGroup>
              </div>
              <div className="mb-3">
                <CFormLabel>Total</CFormLabel>
                <p>{total}</p>
              </div>
              <div className="mb-3">
                <CFormLabel>Fecha de Compra</CFormLabel>
                <p>{fechaCompra}</p>
              </div>
              <CButton type="submit" color="primary" className="mr-2">
                Guardar Compra
              </CButton>
              <Link to="/compras/lista-compras">
              <CButton
                type="button"
                color="secondary"
                onClick={handleCancelar}
              >
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

export default CrearCompra;
