import React, { useEffect, useState } from 'react';
import VentaService from 'src/views/services/ventasService';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const [formValid, setFormValid] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [apellido, setApellido] = useState('');
    const [documento, setDocumento] = useState('');
    const [numeroFactura, setNumeroFactura] = useState('');
    const [mostrarServicio, setMostrarServicio] = useState(false);
    const [mostrarProducto, setMostrarProducto] = useState(false);
    const [selectedServicio, setSelectedServicio] = useState(null);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [serviciosEnVenta, setServiciosEnVenta] = useState([]);
    const [productosEnVenta, setProductosEnVenta] = useState([]);
    const [cantidadProductos, setCantidadProductos] = useState(null);
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

            if (!formValid) {
                // Muestra un mensaje de error o utiliza alguna otra lógica para indicar que el formulario no es válido
                Swal.fire('Error', 'Completa todos los campos obligatorios antes de crear la venta', 'error');
                return;
            }
            
            // Mensaje de éxito
            Swal.fire('Éxito', 'El empleado se ha creado correctamente', 'success');

            // Utiliza el método navigate para redireccionar
            navigate('/ventas/listaVentas');
            // Adjust the following line based on your VentaService API method
            const nextNumeroFactura = getNextNumeroFactura();
            setNumeroFactura(nextNumeroFactura);

            const response = await VentaService.crearVenta({
                clienteId: selectedCliente.id_cliente,
                empleadoId: selectedEmpleado.id_empleado,
                servicios: serviciosEnVenta,
                productos: productosEnVenta,
                totalVenta: totalVenta,
                numeroFactura: nextNumeroFactura,
            });
            console.log('Sale created:', response);
            // Navegar a la nueva ruta después de que la venta se haya creado
        } catch (error) {
            console.error('Error creating sale:', error);
        }
    };

    const getNextNumeroFactura = () => {
        const lastNumeroFactura = ventas.length > 0 ? ventas[ventas.length - 1].numeroFactura : '00';
        const nextNumber = parseInt(lastNumeroFactura, 10) + 1;
        return nextNumber < 10 ? `0${nextNumber}` : `${nextNumber}`;
    };

    const fetchEmpleados = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/empleado`, {
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


    const fetchProductos = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/producto`, {
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
            setFormValid(clienteId !== '' && selectedEmpleado !== null);
        } else {
            // Manejar el caso en que no se encuentra el cliente con el ID especificado
            console.error('Cliente no encontrado con el ID:', clienteId);
            console.log(typeof clienteId)
        }
    };

    const handleEmpleadoChange = (empleadoId) => {
        const selected = empleados.find((empleado) => empleado.id_empleado == empleadoId);
        setSelectedEmpleado(selected);
        setFormValid(selectedCliente !== null && empleadoId !== '');
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
        if (selectedServicio && selectedServicio.valor) {
            const nuevaFilaServicio = {
                id: selectedServicio.id,
                nombre: selectedServicio.nombre,
                cantidad: 1,
                precioTotal: selectedServicio.valor,
            };
            console.log(nuevaFilaServicio)

            setServiciosEnVenta([...serviciosEnVenta, nuevaFilaServicio]);
            setSelectedServicio(null);

            setTotalVenta(totalVenta + nuevaFilaServicio.precioTotal);
        } else {
            console.error('El servicio seleccionado no tiene un valor de venta válido.');
        }
    };


    const handleAgregarProducto = () => {
        if (selectedProducto) {
            let precioTotal = selectedProducto.precioVenta * cantidadProductos;
            const nuevaFilaProducto = {
                id: selectedProducto.id_producto,
                nombre: selectedProducto.nombre,
                cantidad: cantidadProductos, 
                precioUnitario: selectedProducto.precioVenta,
                precioTotal: precioTotal,
            };
            console.log(nuevaFilaProducto)

            setProductosEnVenta([...productosEnVenta, nuevaFilaProducto]);
            // Limpiar la selección después de agregar el producto
            setSelectedProducto(null);

            setTotalVenta(totalVenta + nuevaFilaProducto.precioTotal);
        }
    };

    const handleEliminarServicio = (index) => {
        const nuevasFilas = [...serviciosEnVenta];
        const servicioEliminado = nuevasFilas[index];
        nuevasFilas.splice(index, 1);
        setServiciosEnVenta(nuevasFilas);
        
        // Restar el valor del servicio eliminado del totalVenta
        setTotalVenta(totalVenta - servicioEliminado.precioTotal);
    };

    const handleEliminarProducto = (index) => {
        const nuevasFilas = [...productosEnVenta];
        const productoEliminado = nuevasFilas[index];
        nuevasFilas.splice(index, 1);
        setProductosEnVenta(nuevasFilas);

        // Restar el valor del producto eliminado del totalVenta
        setTotalVenta(totalVenta - productoEliminado.precioTotal);
    };

    const handleMostrarServicio = () => {
        setMostrarServicio(true);
        setMostrarProducto(false);
      };
    
      const handleMostrarProducto = () => {
        setMostrarProducto(true);
        setMostrarServicio(false);
      };

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

                            <div style={{ flex: 1, marginRight: "10px" }}>
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
                            
                            <div style={{ flex: 1, marginRight: "10px" }}>
                                <CFormLabel>Apellido</CFormLabel>
                                <CFormInput value={apellido} readOnly />
                            </div>

                            <div style={{ flex: 1, marginRight: "10px" }}>
                                <CFormLabel>Documento</CFormLabel>
                                <CFormInput value={documento} readOnly />
                            </div >

                            <div style={{ flex: 1, marginRight: "10px" }}>
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
                            
                            <div className="mb-3" style={{ display: 'none' }}>
                                <CFormLabel>Número de Factura</CFormLabel>
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
                                <CButton onClick={handleMostrarServicio}>
                                    Agregar Servicio
                                </CButton>
                                    
                                <CButton onClick={handleMostrarProducto}>
                                    Agregar Producto
                                </CButton>
                            </div>

                            {mostrarServicio && (
                                <div>
                                    <CFormLabel>Agregar Servicios</CFormLabel>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <CFormSelect 
                                        onChange={(e) => handleServicioChange(e.target.value)}
                                        >
                                        <option value="">Seleccionar Servicio</option>
                                        {servicios.map((servicio) => (
                                            <option key={servicio.id} value={servicio.id}>
                                                {servicio.nombre}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                    <CButton
                                    color="success"
                                    onClick={handleAgregarServicio}
                                    style={{ marginLeft: "5px" }}
                                    >
                                        +
                                    </CButton>
                                    </div>
                                </div>
                            )}

                            {mostrarProducto && (
                                <div>
                                    <CFormLabel>Agregar Producto</CFormLabel>
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
                                    type="number"
                                    name="cantidadProductos"
                                    placeholder="Ingrese la cantidad"
                                    value={cantidadProductos}
                                    onChange={(e) => setCantidadProductos(e.target.value)}
                                    style={{ marginLeft: "5px" }}
                                    />
                                    <CButton 
                                        color="success" 
                                        onClick={handleAgregarProducto}
                                        style={{ marginLeft: "5px", marginRight: "-6px" }}
                                    >
                                        +
                                    </CButton>
                                    </div>
                                </div> 
                            </div>       
                        )}


                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
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
                                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                            <CTableDataCell>{servicio.nombre}</CTableDataCell>
                                            <CTableDataCell>{servicio.cantidad}</CTableDataCell>
                                            <CTableDataCell>
                                                {servicio.precioUnitario.toLocaleString("es-CO", {
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
                                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                            <CTableDataCell>{producto.nombre}</CTableDataCell>
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


                            <div className="mb-3">
                                <CFormLabel>Total de la Venta</CFormLabel>
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

                            <CButton color="primary" onClick={createSale}>
                                Crear
                            </CButton>

                            <Link to="/ventas/listaVentas" style={{ marginRight: "5px" }}>
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
