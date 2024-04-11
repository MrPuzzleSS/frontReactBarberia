import React, { useEffect, useState } from 'react';
import VentaService from 'src/views/services/ventasService';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaCheck   } from 'react-icons/fa'; 
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

const API_URL = 'https://restapibarberia.onrender.com/api';

function FormularioVentas() {
    const navigate = useNavigate();
    const [formValid, setFormValid] = useState(false);
    const [mostrarServicio, setMostrarServicio] = useState(false);
    const [mostrarProducto, setMostrarProducto] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [serviciosEnVenta, setServiciosEnVenta] = useState([]);
    const [productosEnVenta, setProductosEnVenta] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [selectedServicio, setSelectedServicio] = useState(null);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [apellido, setApellido] = useState('');
    const [documento, setDocumento] = useState('');
    const [numeroFactura, setNumeroFactura] = useState('');
    const [totalVenta, setTotalVenta] = useState(0);
    const [cantidadProductos, setCantidadProductos] = useState(0);
    const [cantidadServicios, setCantidadServicios] = useState(1);
    const [estadoVenta, setEstadoVenta] = useState('Pendiente');


    //llamo los fetch para llamar los datos de los modulos
    useEffect(() => {
        fetchClientes();
        fetchServicios();
        fetchProductos();
        fetchVentas();
        fetchEmpleados();
    }, []);


    //crear la venta
    const createSale = async () => {
        try {
            if (!formValid) {
                Swal.fire('Error', 'Completa todos los campos obligatorios antes de crear la venta', 'error');
                return;
            }
            // Verificar stock de productos en la venta
            for (const producto of productosEnVenta) {
                const response = await fetch(`${API_URL}/producto/${producto.id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    const stockDisponible = data.stock;
                    if (producto.cantidad > stockDisponible) {
                        Swal.fire('Error', `No hay suficiente stock disponible para el producto ${producto.nombre}. Stock disponible: ${stockDisponible}`, 'error');
                        return;
                    }
                } else {
                    console.error('Error al obtener el stock del producto:', data);
                    return;
                }
            }

            Swal.fire('Venta Éxitosa', 'La Venta se ha creado correctamente', 'success');

            const nextNumeroFactura = getNextNumeroFactura();
            setNumeroFactura(nextNumeroFactura);

            const response = await VentaService.crearVenta({
                clienteId: selectedCliente.id_cliente,
                empleadoId: selectedEmpleado.id_empleado,
                servicios: serviciosEnVenta,
                productos: productosEnVenta,
                totalVenta: totalVenta,
                numeroFactura: nextNumeroFactura,
                estado: estadoVenta,
            });
            console.log('Sale created:', response);

            navigate('/ventas/listaVentas');
        } catch (error) {
            console.error('Error creating sale:', error);
        }
    };


    //numero de factura que se carga automaticamente
    const getNextNumeroFactura = () => {
        const lastNumeroFactura = ventas.length > 0 ? ventas[ventas.length - 1].numeroFactura : '00';
        const nextNumber = parseInt(lastNumeroFactura, 10) + 1;
        return nextNumber < 10 ? `0${nextNumber}` : `${nextNumber}`;
    };


    //llamo a la lista de los empleados
    const fetchEmpleados = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/empleado/activos`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data && data.empleados) {
                setEmpleados(data.empleados);
            } else {
                console.error('Error la lista de empleados:', data);
            }
        } catch (error) {
            console.error('Error la lista de empleados:', error);
        }
    };


    //llamo a la lista de clientes
    const fetchClientes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/cliente`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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


    //llamo a la lista de servicios
    const fetchServicios = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/servicio`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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


    //llamo a la lista de productos
    const fetchProductos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/producto/activos`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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


    //llamo a las ventas
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


    //tomo los datos para cargar el cliente
    const handleClienteChange = (clienteId) => {
        const selected = clientes.find((cliente) => cliente.id_cliente == clienteId);
        if (selected) {
            setSelectedCliente(selected);
            setApellido(selected.apellido || '');
            setDocumento(selected.documento || '');
            setFormValid(clienteId !== '' && selectedEmpleado !== null);
            console.log(clientes)
        } else {
            console.error('Cliente no encontrado con el ID:', clienteId);
            console.log(typeof clienteId)
        }
    };


    //tomo los datos para cargar el empleado
    const handleEmpleadoChange = (empleadoId) => {
        const selected = empleados.find((empleado) => empleado.id_empleado == empleadoId);
        setSelectedEmpleado(selected || null);
        setFormValid(selectedCliente !== null && empleadoId !== '');
    };


    //tomo los datos para cargar los servicios
    const handleServicioChange = (servicioId) => {
        const selected = servicios.find((servicio) => servicio.id == servicioId);
        setSelectedServicio(selected);
    };


    //tomo los datos para cargar los productos
    const handleProductoChange = (productoId) => {
        const selected = productos.find((producto) => producto.nombre == productoId);
        setSelectedProducto(selected);
        console.log(productoId)
    };


    //creo los servicios
    const handleAgregarServicio = () => {
        if (selectedServicio) {
            let precioTotal = selectedServicio.valor * cantidadServicios;
            console.log("precio total del servicio:", precioTotal)
            const nuevaFilaServicio = {
                id: selectedServicio.id,
                nombre: selectedServicio.nombre,
                cantidad: cantidadServicios,
                precioUnitario: selectedServicio.valor,
                precioTotal: precioTotal,
            };
            console.log(nuevaFilaServicio)

            setServiciosEnVenta([...serviciosEnVenta, nuevaFilaServicio]);
            setSelectedServicio(null);

            setTotalVenta(totalVenta + nuevaFilaServicio.precioTotal);
        } else {
            console.error('El servicio seleccionado no tiene un valor de venta válido.');
        }
    };


    //creo los productos
    const handleAgregarProducto = () => {
        if (selectedProducto) {
            let precioTotal = selectedProducto.precioVenta * cantidadProductos;
            console.log("Precio total del producto:", precioTotal);
            const nuevaFilaProducto = {
                id: selectedProducto.id_producto,
                nombre: selectedProducto.nombre,
                cantidad: cantidadProductos,
                precioUnitario: selectedProducto.precioVenta,
                precioTotal: precioTotal,
            };
            console.log(nuevaFilaProducto)

            setProductosEnVenta([...productosEnVenta, nuevaFilaProducto]);
            setSelectedProducto(null);

            setTotalVenta(totalVenta + nuevaFilaProducto.precioTotal);
        }
    };


    //elimino los servicios creados
    const handleEliminarServicio = (index) => {
        const nuevasFilas = [...serviciosEnVenta];
        const servicioEliminado = nuevasFilas[index];
        nuevasFilas.splice(index, 1);
        setServiciosEnVenta(nuevasFilas);

        setTotalVenta(totalVenta - servicioEliminado.precioTotal);
    };


    //elimino los productos creados
    const handleEliminarProducto = (index) => {
        const nuevasFilas = [...productosEnVenta];
        const productoEliminado = nuevasFilas[index];
        nuevasFilas.splice(index, 1);
        setProductosEnVenta(nuevasFilas);

        setTotalVenta(totalVenta - productoEliminado.precioTotal);
    };


    //mostrar la lista en el select con la cantidad
    const handleMostrarServicio = () => {
        setMostrarServicio(true);
        setMostrarProducto(false);
    };


    //mostrar la lista en el select con la cantidad
    const handleMostrarProducto = () => {
        setMostrarProducto(true);
        setMostrarServicio(false);
    };
  
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                            <strong>Crear Venta</strong>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <form>
                            <CRow>
                                <CCol xs={12} sm={6}> {/* Primera columna */}
                                    <div style={{ marginBottom: "10px" }}>
                                        <CFormLabel style={{ fontWeight: 'bold' }}>Cliente</CFormLabel>
                                        <CFormSelect onChange={(e) => handleClienteChange(e.target.value)}>
                                            <option value="">Seleccionar Cliente</option>
                                            {clientes.map((cliente) => (
                                                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                                                    {cliente.nombre}
                                                </option>
                                            ))}
                                        </CFormSelect>
                                    </div>
                                    <div style={{ marginBottom: "10px" }}>
                                        <CFormLabel style={{ fontWeight: 'bold' }}>Apellido</CFormLabel>
                                        <CFormInput value={apellido || ''} readOnly />
                                    </div>
                                </CCol>
                                <CCol xs={12} sm={6}> {/* Segunda columna */}
                                    <div style={{ marginBottom: "10px" }}>
                                        <CFormLabel style={{ fontWeight: 'bold' }}>Documento</CFormLabel>
                                        <CFormInput value={documento || ''} readOnly />
                                    </div >

                                    <div style={{ marginBottom: "10px" }}>
                                        <CFormLabel style={{ fontWeight: 'bold' }}>Empleado</CFormLabel>
                                        <CFormSelect onChange={(e) => handleEmpleadoChange(e.target.value)}>
                                            <option value="">Seleccionar Empleado</option>
                                            {empleados.map((empleado) => (
                                                <option key={empleado.id_empleado} value={empleado.id_empleado}>
                                                    {empleado.nombre}
                                                </option>
                                            ))}
                                        </CFormSelect>
                                    </div>
                                </CCol>
                            </CRow>

                            <div style={{ flex: 1, marginRight: "10px", marginBottom: "10px", display: "flex", flexDirection: "column" }}>
                                <CFormLabel style={{ fontWeight: 'bold' }}>Estado de la Venta</CFormLabel>
                                <CFormSelect
                                    onChange={(e) => setEstadoVenta(e.target.value)}
                                    value={estadoVenta}
                                    style={{ width: "50%" }} // Establece el ancho del select
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Pagado">Pagado</option>
                                </CFormSelect>
                            </div>


                            <div className="mb-3" style={{ display: 'none' }}>
                                <CFormLabel style={{ fontWeight: 'bold' }}>Número de Factura</CFormLabel>
                                <CFormInput
                                    type="text"
                                    name="numeroFactura"
                                    value={numeroFactura}
                                    readOnly
                                />
                            </div>

                            <br></br>

                            <hr />

                            <br></br>

                            <div className="mb-3">
                                <CButton onClick={handleMostrarServicio} style={{ marginRight: "5px" }}>
                                    Agregar Servicio
                                </CButton>

                                <CButton onClick={handleMostrarProducto}>
                                    Agregar Producto
                                </CButton>
                            </div>

                            {mostrarServicio && (
                                <div>
                                    <CFormLabel style={{ fontWeight: 'bold' }}>Agregar Servicios</CFormLabel>
                                    <div
                                        className="mb-3"
                                        style={{ display: "flex", alignItems: "center" }}
                                    >
                                        <div
                                            style={{
                                                flex: 1,
                                                marginRight: "5px",
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <CFormSelect
                                                onChange={(e) => handleServicioChange(e.target.value)}
                                            >
                                                <option value="">Seleccionar Servicio</option>
                                                {servicios.map((servicio) => (
                                                    <option
                                                        key={servicio.id}
                                                        value={servicio.id}
                                                    >
                                                        {servicio.nombre}
                                                    </option>
                                                ))}
                                            </CFormSelect>
                                            <CFormInput
                                                type="text"
                                                name="cantidadServicios"
                                                placeholder="Ingrese la cantidad"
                                                value={cantidadServicios}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                          
                                                    if (/^\d*$/.test(value)) {
                                                      setCantidadServicios(value);
                                                    }
                                                  }}
                                                style={{ marginLeft: "5px" }}
                                            />
                                            <CButton
                                                color="primary"
                                                onClick={handleAgregarServicio}
                                                style={{ marginLeft: "5px" }}
                                            >
                                              <FaCheck   />  
                                            </CButton>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {mostrarProducto && (
                                <div>
                                    <CFormLabel style={{ fontWeight: 'bold' }}>Agregar Producto</CFormLabel>
                                    <div
                                        className="mb-3"
                                        style={{ display: "flex", justifyContent: "center" }}
                                    >
                                        <div
                                            style={{
                                                flex: 1,
                                                marginRight: "5px",
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <CFormSelect
                                                onChange={(e) => handleProductoChange(e.target.value)}
                                            >
                                                <option value="">Seleccionar Producto</option>
                                                {productos.map((producto) => (
                                                    <option
                                                        key={producto.id_productos}
                                                        value={producto.id_productos}
                                                    >
                                                        {producto.nombre}
                                                    </option>
                                                ))}
                                            </CFormSelect>
                                            <CFormInput
                                                type="text"
                                                name="cantidadProductos"
                                                placeholder="Ingrese la cantidad"
                                                value={cantidadProductos}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                        
                                                    if (/^\d*$/.test(value)) {
                                                      setCantidadProductos(value);
                                                    }
                                                }}
                                                style={{ marginLeft: "5px" }}
                                            />
                                            <CButton
                                                color="primary"
                                                onClick={handleAgregarProducto}
                                                style={{ marginLeft: "5px", marginRight: "-6px" }}
                                            >
                                                <FaCheck   />  
                                            </CButton>
                                        </div>
                                    </div>
                                </div>
                            )}


                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        {/* <CTableHeaderCell scope="col">#</CTableHeaderCell> */}
                                        <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Cantidad</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Precio Unitario</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Precio Total</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>

                                <CTableBody>
                                    {serviciosEnVenta.map((servicio, index) => (
                                        <CTableRow key={index}>
                                            {/* <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell> */}

                                            <CTableDataCell>{capitalizeFirstLetter(servicio.nombre)}</CTableDataCell>
                                            <CTableDataCell>{servicio.cantidad}</CTableDataCell>
                                            <CTableDataCell>
                                                {servicio.precioUnitario && servicio.precioUnitario.toLocaleString("es-CO", {
                                                    style: "currency",
                                                    currency: "COP",
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </CTableDataCell>

                                            <CTableDataCell>
                                                {servicio.precioTotal.toLocaleString("es-CO", {
                                                    style: "currency",
                                                    currency: "COP",
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </CTableDataCell>

                                            <CTableDataCell>
                                                {/* Agrega botón de eliminar o cualquier otra acción que necesites */}
                                                <CButton
                                                    color="danger"
                                                    onClick={() => handleEliminarServicio(index)}
                                                >
                                                    Eliminar
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                    {productosEnVenta.map((producto, index) => (
                                        <CTableRow key={index}>
                                            {/* <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell> */}
                                            <CTableDataCell>{capitalizeFirstLetter(producto.nombre)}</CTableDataCell>
                                            <CTableDataCell>{producto.cantidad}</CTableDataCell>
                                            <CTableDataCell>
                                                {producto.precioUnitario.toLocaleString("es-CO", {
                                                    style: "currency",
                                                    currency: "COP",
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </CTableDataCell>

                                            <CTableDataCell>
                                                {producto.precioTotal.toLocaleString("es-CO", {
                                                    style: "currency",
                                                    currency: "COP",
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </CTableDataCell>

                                            <CTableDataCell>
                                                {/* Agrega botón de eliminar o cualquier otra acción que necesites */}
                                                <CButton
                                                    color="danger"
                                                    onClick={() => handleEliminarProducto(index)}
                                                >
                                                    Eliminar
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>

                            <CCol md="4"> {/* Define el ancho de la columna para dispositivos medianos */}
                                <div className="mb-4">
                                    <CFormLabel style={{ fontWeight: 'bold' }}>Total de la Venta</CFormLabel>
                                    <CFormInput
                                        value={totalVenta.toLocaleString("es-CO", {
                                            style: "currency",
                                            currency: "COP",
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                        readOnly
                                    />
                                </div>
                            </CCol>

                            <CButton onClick={createSale} style={{ marginRight: "5px" }}>
                                Crear Venta
                            </CButton>

                            <Link to="/ventas/listaVentas">
                                <CButton color="secondary">Cancelar</CButton>
                            </Link>
                        </form>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
}

export default FormularioVentas;
