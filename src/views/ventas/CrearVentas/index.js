import React, { useEffect, useState } from 'react';
import VentaService from 'src/views/services/ventasService'; 
import { Link } from 'react-router-dom';
import {
    CFormLabel,
    CFormSelect,
    CFormInput,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CInputGroup,
    CInputGroupText,
} from '@coreui/react';

const API_URL = 'http://localhost:8095/api';

function FormularioVentas() {
    const [clientes, setClientes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [apellido, setApellido] = useState('');
    const [documento, setDocumento] = useState('');
    const [numeroFactura, setNumeroFactura] = useState('');
    const [showServicios, setShowServicios] = useState(false);
    const [showProductos, setShowProductos] = useState(false);
    const [selectedServicio, setSelectedServicio] = useState(null);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [serviciosEnVenta, setServiciosEnVenta] = useState([]);
    const [productosEnVenta, setProductosEnVenta] = useState([]);
    const [totalVenta, setTotalVenta] = useState(0);

    useEffect(() => {
        fetchClientes();
        fetchServicios();
        fetchProductos();
        fetchVentas();
        fetchEmpleados();
    }, []);



    const createSale = async () => {
        try {
            // Adjust the following line based on your VentaService API method
            const response = await VentaService.crearVenta({
                clienteId: selectedCliente.id_cliente,
                empleadoId: selectedEmpleado.id_empleado,
                servicios: serviciosEnVenta,
                productos: productosEnVenta,
                totalVenta: totalVenta,
                numeroFactura: numeroFactura,
        });
    
            console.log('Sale created:', response);
        } catch (error) {
            console.error('Error creating sale:', error);
        }
    };

    
    const fetchEmpleados = async () => {
        try{
            const response = await fetch(`${API_URL}/empleado`);
            const data = await response.json();
            if (data && data.empleados){
                setEmpleados(data.empleados);
            } else {
                console.error('Error la lista de empleados:', data);
            }
        } catch (error) {
            console.error('Error la lista de empleados:', error);
        }
    };

    const fetchClientes = async () => {
        try {
            const response = await fetch(`${API_URL}/cliente`);
            const data = await response.json();
            if (data && data.listClientes) {
                setClientes(data.listClientes);
            } else {
                console.error('Error al obtener la lista de clientes:', data);
            }
        } catch (error) {
            console.error('Error al obtener la lista de clientes:', error);
        }
    };

    const fetchServicios = async () => {
        try {
            const response = await fetch(`${API_URL}/servicio`);
            const data = await response.json();
            if (data && data.listServicios) {
                setServicios(data.listServicios);
            } else {
                console.error('Error al obtener la lista de servicios:', data);
            }
        } catch (error) {
            console.error('Error al obtener la lista de servicios:', error);
        }
    };

    const fetchProductos = async () => {
        try {
            const response = await fetch(`${API_URL}/producto`);
            const data = await response.json();
            if (data && data.productos) {
                setProductos(data.productos);
            } else {
                console.error('Error al obtener la lista de productos:', data);
            }
        } catch (error) {
            console.error('Error al obtener la lista de productos:', error);
        }
    };

    const fetchVentas = async () => {
        try {
            const data = await VentaService.getVentas();
            if (data && data.ventas) {
                setVentas(data.ventas);
            } else {
                console.error('La respuesta de la API no contiene la propiedad "ventas":', data);
            }
        } catch (error) {
            console.error('Error al obtener las ventas:', error);
        }
    };

    const handleClienteChange = (clienteId) => {
        const selected = clientes.find((cliente) => cliente.id_cliente == clienteId);
        if (selected) {
            setSelectedCliente(selected);
            setApellido(selected.apellido);
            setDocumento(selected.documento);
        } else {
            // Manejar el caso en que no se encuentra el cliente con el ID especificado
            console.error('Cliente no encontrado con el ID:', clienteId);
            console.log(typeof clienteId)
        }
    };

    const handleEmpleadoChange = (empleadoId) => {
        const selected = empleados.find((empleado) => empleado.id_empleado == empleadoId);
        setSelectedEmpleado(selected);
    };

    const handleServicioChange = (servicioId) => {
        const selected = servicios.find((servicio) => servicio.id == servicioId);
        setSelectedServicio(selected);
    };

    const handleProductoChange = (productoId) => {
        const selected = productos.find((producto) => producto.nombre == productoId);
        setSelectedProducto(selected);
        console.log(productoId)
    };

    const handleAgregarServicio = () => {
        if (selectedServicio) {
            const nuevaFilaServicio = {
                id: selectedServicio.id,
                nombre: selectedServicio.nombre,
                cantidad: 1, // Puedes ajustar la cantidad según tus necesidades
                precioTotal: selectedServicio.valor,
            };

            setServiciosEnVenta([...serviciosEnVenta, nuevaFilaServicio]);
            // Limpiar la selección después de agregar el servicio
            setSelectedServicio(null);

            setTotalVenta(totalVenta + nuevaFilaServicio.precioTotal);
        }
    };


    const handleAgregarProducto = () => {
        if (selectedProducto) {
            const nuevaFilaProducto = {
                id: selectedProducto.id_productos,
                nombre: selectedProducto.nombre,
                cantidad: 1, // Puedes ajustar la cantidad según tus necesidades
                precioTotal: selectedProducto.precio,
            };

            setProductosEnVenta([...productosEnVenta, nuevaFilaProducto]);
            // Limpiar la selección después de agregar el producto
            setSelectedProducto(null);

            setTotalVenta(totalVenta + nuevaFilaProducto.precioTotal);
        }
    };

    const handleEliminarServicio = (index) => {
        const nuevasFilas = [...serviciosEnVenta];
        nuevasFilas.splice(index, 1);
        setServiciosEnVenta(nuevasFilas);
    };

    const handleEliminarProducto = (index) => {
        const nuevasFilas = [...productosEnVenta];
        nuevasFilas.splice(index, 1);
        setProductosEnVenta(nuevasFilas);
    };


    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                            <strong>Crear Venta</strong>
                            <Link to="ruta/de/tu/agregar/ventas">
                                <CButton color="primary">Agregar Venta</CButton>
                            </Link>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <form>
                            <div className="mb-3">
                                <CFormLabel>Cliente</CFormLabel>
                                <CFormSelect onChange={(e) => handleClienteChange(e.target.value)}>
                                    <option value="">Seleccionar Cliente</option>
                                    {clientes.map((cliente) => (
                                        <option key={cliente.id_cliente} value={cliente.id_cliente}>
                                            {cliente.nombre}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Apellido</CFormLabel>
                                <CFormInput value={apellido} readOnly />
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Documento</CFormLabel>
                                <CFormInput value={documento} readOnly />
                            </div >
                            <div className="mb-3">
                                <CFormLabel>Empleado</CFormLabel>
                                <CFormSelect onChange={(e) => handleEmpleadoChange(e.target.value)}>
                                <option value="">Seleccionar Empleado</option>
                                {empleados.map((empleado) => (
                                        <option key={empleado.id_empleado} value={empleado.id_empleado}>
                                            {empleado.nombre}
                                        </option>
                                    ))}                                
                                </CFormSelect>
                            </div>
                            
                            <div className="mb-3">
                                <CFormLabel>Número de Factura</CFormLabel>
                                <CFormInput
                                    type="text"
                                    name="numeroFactura"
                                    value={numeroFactura}
                                    onChange={(e) => setNumeroFactura(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <CButton color="primary" onClick={() => setShowServicios(true)}>
                                    Servicios
                                </CButton>
                                <CButton color="primary" onClick={() => setShowProductos(true)}>
                                    Productos
                                </CButton>
                            </div>

                            {showServicios && (
                                <div>
                                    <CFormSelect onChange={(e) => handleServicioChange(e.target.value)}>
                                        <option value="">Seleccionar Servicio</option>
                                        {servicios.map((servicio) => (
                                            <option key={servicio.id} value={servicio.id}>
                                                {servicio.nombre}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                    <CButton color="success" onClick={handleAgregarServicio}>
                                        Agregar Servicio
                                    </CButton>
                                </div>
                            )}

                            {showProductos && (
                                <div>
                                    <CFormSelect onChange={(e) => handleProductoChange(e.target.value)}>
                                        <option value="">Seleccionar Producto</option>
                                        {productos.map((producto) => (
                                            <option key={producto.id_productos} value={producto.id_productos}>
                                                {producto.nombre}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                    <CButton color="success" onClick={handleAgregarProducto}>
                                        Agregar Producto
                                    </CButton>
                                </div>
                            )}

                            {/* Resto del formulario */}

                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Cantidad</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Precio Total</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {serviciosEnVenta.map((servicio, index) => (
                                        <CTableRow key={index}>
                                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                            <CTableDataCell>{servicio.nombre}</CTableDataCell>
                                            <CTableDataCell>{servicio.cantidad}</CTableDataCell>
                                            <CTableDataCell>{servicio.precioTotal}</CTableDataCell>
                                            <CTableDataCell>
                                                {/* Agrega botón de eliminar o cualquier otra acción que necesites */}
                                                <CButton color="danger" onClick={() => handleEliminarServicio(index)}>
                                                    Eliminar
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                    {productosEnVenta.map((producto, index) => (
                                        <CTableRow key={index}>
                                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                            <CTableDataCell>{producto.nombre}</CTableDataCell>
                                            <CTableDataCell>{producto.cantidad}</CTableDataCell>
                                            <CTableDataCell>{producto.precioTotal}</CTableDataCell>
                                            <CTableDataCell>
                                                {/* Agrega botón de eliminar o cualquier otra acción que necesites */}
                                                <CButton color="danger" onClick={() => handleEliminarProducto(index)}>
                                                    Eliminar
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>


                            <div className="mb-3">
                                <CFormLabel>Total de la Venta</CFormLabel>
                                <CFormInput value={totalVenta.toString()} readOnly />
                            </div>
                            <CButton color="primary" onClick={createSale}>
                                Crear
                            </CButton>
                            <Link to="/ventas/listaVentas">
                                <CButton color="danger">Cancelar</CButton>
                            </Link>
                        </form>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
}

export default FormularioVentas;
