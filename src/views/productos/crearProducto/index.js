import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    const [proveedores, setProveedores] = useState([]); // Lista de proveedores
    const [selectedProveedor, setSelectedProveedor] = useState(''); // Proveedor seleccionado
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');

    const fetchProveedores = async () => {
        try {
            const proveedoresData = await ProductoService.obtenerProveedores();
            if (proveedoresData && proveedoresData.listProveedores) {
                setProveedores(proveedoresData.listProveedores);
            } else {
                console.error('La respuesta de obtenerProveedores no tiene la estructura esperada:', proveedoresData);
            }
        } catch (error) {
            console.error('Error al obtener proveedores:', error);
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, []);

    const handleGuardarProducto = async (e) => {
        e.preventDefault();

        const newProducto = {
            id_proveedor: selectedProveedor,
            nombre,
            descripcion,
            precio,
            stock,
        };

        try {
            const response = await ProductoService.createProducto(newProducto);
            console.log('Producto creado:', response);

            setSelectedProveedor('');
            setNombre('');
            setDescripcion('');
            setPrecio('');
            setStock('');
        } catch (error) {
            console.error('Error al crear el producto:', error);
        }
    };



    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardHeader>
                        <strong>Crear Producto</strong>
                    </CCardHeader>
                    <CCardBody>
                        <form onSubmit={handleGuardarProducto}>
                            <CRow>
                                <CCol xs={12}>
                                    <h2>Lista de Proveedores</h2>
                                    <select
                                        value={selectedProveedor}
                                        onChange={(e) => setSelectedProveedor(e.target.value)}
                                    >
                                        <option value="">Seleccionar proveedor</option>
                                        {proveedores.map((proveedor) => (
                                            <option key={proveedor.id} value={proveedor.id}>
                                                {proveedor.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </CCol>
                            </CRow>

                            <div className="mb-3">
                                <CFormLabel>Nombre</CFormLabel>
                                <CFormInput
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Descripción</CFormLabel>
                                <CFormInput
                                    type="text"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Precio</CFormLabel>
                                <CFormInput
                                    type="number"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Stock</CFormLabel>
                                <CFormInput
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                            </div>
                            <CButton type="submit" color="primary" className="mr-2">
                                Guardar Producto
                            </CButton>
                            <Link to="/Productos/lista-Productos">
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

export default CrearProducto;
