import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';

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
import ProductoService from 'src/views/services/productoService';

function CrearProducto() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precioCosto, setPrecioCosto] = useState(0);
  const [precioVenta, setPrecioVenta] = useState(0);
  const [stock, setStock] = useState(0);
  const [tipo, setTipo] = useState('');
  const [tipoValido, setTipoValido] = useState(false);
  const [nombreValido, setNombreValido] = useState(true);
  const [descripcionValida, setDescripcionValida] = useState(true);

  useEffect(() => {
    // Cualquier inicialización necesaria aquí
  }, []);

  const handleIngresoManual = (campo, valor) => {
    switch (campo) {
      case 'nombre':
        setNombre(valor);
        validarNombre(valor);
        break;
      case 'descripcion':
        setDescripcion(valor);
        validarDescripcion(valor);
        break;
      case 'precioCosto':
        setPrecioCosto(valor);
        break;
      case 'precioVenta':
        setPrecioVenta(valor);
        break;
      case 'stock':
        setStock(valor);
        break;
      case 'tipo':
        setTipo(valor);
        validarTipo(valor);
        break;
      default:
        break;
    }
  };

  const validarNombre = (valor) => {
    const nombreRegex = /^[a-zA-Z0-9\sñáéíóúÁÉÍÓÚüÜ]+$/;
    setNombreValido(nombreRegex.test(valor) && valor.length >= 3 && valor.length <= 20);
  };
  
  const validarDescripcion = (valor) => {
    const descripcionRegex = /^[a-zA-Z0-9\sñáéíóúÁÉÍÓÚüÜ]+$/;
    setDescripcionValida(descripcionRegex.test(valor) && valor.length >= 3 && valor.length <= 20);
  };
  

  const validarTipo = (valor) => {
    setTipoValido(valor !== '');
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const apiUrl = ' http://localhost:8095/api/producto';

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const handleGuardarProducto = async (e) => {
    e.preventDefault();

    if (!nombreValido) {
      mostrarError('El campo Nombre solo puede contener letras, números y espacios y no menos de 3 caracteres.');
      return;
    }

    if (!descripcionValida) {
      mostrarError('El campo Descripción solo puede contener letras, números y algunos caracteres especiales y no menos de 3 caracteres.');
      return;
    }

    if (!tipoValido) {
      mostrarError('Debe seleccionar un tipo.');
      return;
    }

    if (precioCosto < 0 || precioVenta < 0 || stock < 0) {
      mostrarError('Los campos Precio Costo, Precio Venta y Stock no pueden ser negativos.');
      return;
    }

    try {
      const token = getToken();
      const headers = { 'Authorization': `Bearer ${token}` };

      const response = await axios.get(apiUrl, { headers });
      const productos = response.data.productos;

      const existeProducto = productos.some(producto => producto.nombre === nombre);
      if (existeProducto) {
        mostrarError('Ya existe un producto con este nombre. Por favor, elija otro nombre para el producto.');
        return;
      }

      guardarProducto();
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      mostrarError('Hubo un error al obtener los productos.');
    }
  };

  const mostrarError = (mensaje) => {
    Swal.fire({ icon: 'error', title: 'Error', text: mensaje });
  };

  const guardarProducto = async () => {
    const nombreCapitalizado = capitalizeFirstLetter(nombre);
    const descripcionCapitalizado = capitalizeFirstLetter(descripcion);
    setNombre(nombreCapitalizado);

    const nuevoProducto = {
      nombre: nombreCapitalizado,
      descripcion: descripcionCapitalizado,
      precioCosto,
      precioVenta,
      stock,
      tipoCompra: tipo,
    };

    try {
      const response = await ProductoService.createProducto(nuevoProducto);

      if (response) {
        console.log('Producto guardado:', response.producto);
        Swal.fire({ icon: 'success', title: 'Éxito', text: 'Producto guardado exitosamente.' }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            setTimeout(() => { window.location.href = '/Productos/lista-Productos'; }, 1000);
          }
        });
      } else {
        console.error('Error al guardar el producto:', response.error);
        mostrarError('Hubo un error al guardar el producto.');
      }
    } catch (error) {
      console.error('Error el Nombre del producto ya existe :', error);
      mostrarError('Error el Nombre del producto ya existe, ingrese un nombre diferente .');
    }
  };

  const tipoOptions = [
    { value: 'Producto', label: 'Producto' },
    { value: 'Insumo', label: 'Insumo' },
  ];

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Crear Producto</strong>
          </CCardHeader>

          <CCardBody>
            <div>
              <CCol xs={5}>
                <div className="mb-3">
                  <CFormLabel style={{ fontWeight: 'bold' }}>
                    Nombre<span style={{ color: 'red' }}>*</span>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    value={nombre}
                    onChange={(e) => handleIngresoManual('nombre', capitalizeFirstLetter(e.target.value))}
                    required
                  />
                  {!nombreValido && (
                    <span className="text-danger">El campo Nombre solo puede contener letras, números y espacios y no menos de 3 caracteres y max 20.</span>
                  )}
                </div>
                <div className="mb-3">
                  <CFormLabel style={{ fontWeight: 'bold' }}>
                    Descripción<span style={{ color: 'red' }}>*</span>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    value={descripcion}
                    onChange={(e) => handleIngresoManual('descripcion', e.target.value)}
                    required
                  />
                  {!descripcionValida && (
                    <span className="text-danger">El campo Descripción solo puede contener letras, números y espacios y no menos de 3 caracteres y max 20.</span>
                  )}
                </div>
                <div className="mb-3">
                  <CFormLabel style={{ fontWeight: 'bold' }}>
                    Tipo<span style={{ color: 'red' }}>*</span>
                  </CFormLabel>
                  <Select
                    options={tipoOptions}
                    value={tipoOptions.find((option) => option.value === tipo)}
                    onChange={(selectedOption) => handleIngresoManual('tipo', selectedOption.value)}
                    required
                  />
                  {!tipoValido && (
                    <span className="text-danger">Debe seleccionar un tipo.</span>
                  )}
                </div>
              </CCol>

              <CCol xs={4}>
                <CButton type="button" color="primary" onClick={handleGuardarProducto}>
                  Guardar Cambios
                </CButton>
                <Link to="/Productos/lista-Productos">
                  <CButton type="button" color="secondary">
                    Cancelar
                  </CButton>
                </Link>
              </CCol>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}

export default CrearProducto;
