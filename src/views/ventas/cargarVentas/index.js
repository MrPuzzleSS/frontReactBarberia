import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VentaService from "src/views/services/ventasService";
import { Link } from "react-router-dom";
import axios from "axios";
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
} from "@coreui/react";
import citasServiciosDataService from "src/views/services/citasServiciosService";

const API_URL = "https://restapibarberia.onrender.com/api";

function CargarVentas() {

  const history = useNavigate();

  const [visible, setVisible] = useState(false);
  const [errorCedula, setErrorCedula] = useState(false);
  const [mostrarServicio, setMostrarServicio] = useState(false);
  const [mostrarProducto, setMostrarProducto] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [citas, setCitas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [serviciosEnVenta, setServiciosEnVenta] = useState([]);
  const [productosEnVenta, setProductosEnVenta] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [citaData, setCitaData] = useState(null);
  const [cantidadProductos, setCantidadProductos] = useState(null);
  const [cantidadServicios, setCantidadServicios] = useState(null);
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [numeroFactura, setNumeroFactura] = useState("");
  const [nuevoNumeroCedula, setNumeroCita] = useState("");
  const [citaId, setCitaId] = useState("");
  const [totalVenta, setTotalVenta] = useState(0);

  //citas con usuario
  const [selectedUsuario, setSelectedUsuario] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesPromise = fetchClientes();
        const usuariosPromise = fetchUsuario();
        const serviciosPromise = fetchServicios();
        const productosPromise = fetchProductos();
        const ventasPromise = fetchVentas();
        const empleadosPromise = fetchEmpleados();

        await Promise.all([clientesPromise, serviciosPromise, productosPromise, ventasPromise, empleadosPromise, usuariosPromise]);
  
        fetchCitas();
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
    fetchData();
  }, [citaId]);



  const getNextNumeroFactura = () => {
    const lastNumeroFactura =
      ventas.length > 0 ? ventas[ventas.length - 1].numeroFactura : "00";
    const nextNumber = parseInt(lastNumeroFactura, 10) + 1;
    return nextNumber < 10 ? `0${nextNumber}` : `${nextNumber}`;
  };



  const createSale = async () => {
    try {
      const nextNumeroFactura = getNextNumeroFactura();
      setNumeroFactura(nextNumeroFactura);
      const response = await VentaService.crearVenta({
        citaId: citaData.id_cita,
        usuarioId: selectedUsuario.id_usuario,
        //clienteId: selectedCliente.id_cliente,
        empleadoId: selectedEmpleado.id_empleado,
        servicios: serviciosEnVenta,
        productos: productosEnVenta,
        totalVenta: totalVenta,
        numeroFactura: nextNumeroFactura,
      });
      console.log("Sale created:", response);
      setTimeout(() => {
        history("/ventas/listaVentas");
      }, 1000);
    } catch (error) {
      console.error("Error creating sale:", error);
    }
  };


  const fetchCitasData = async (id_usuario) => {
    try {
      const response = await axios.post(`${API_URL}/citashoy`, {
        id_usuario: id_usuario,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCitaData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener los datos de la cita:", error);
    }
  };



  const fetchUsuario = async () => {
    try {
      const response = await fetch(`${API_URL}/usuario`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data && data.usuarios) {
        setUsuarios(data.usuarios);
        console.log(data.usuarios);
      } else {
        console.error("Error la lista de usuarios:", data);
      }
    } catch (error) {
      console.error("Error la lista de usuarios", error);
    }
  };



  const fetchEmpleados = async () => {
    try {
      const response = await fetch(`${API_URL}/empleado`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data && data.empleados) {
        setEmpleados(data.empleados);
      } else {
        console.error("Error la lista de empleados:", data);
      }
    } catch (error) {
      console.error("Error la lista de empleados:", error);
    }
  };



  const fetchClientes = async () => {
    try {
      const response = await axios.get(`${API_URL}/cliente`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setClientes(response.data.listClientes);
    } catch (error) {
      console.error("Error al obtener la lista de clientes:", error);
    }
  };



  const fetchServicios = async () => {
    try {
      const response = await fetch(`${API_URL}/servicio`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data && data.listServicios) {
        setServicios(data.listServicios);
        console.log(data.listServicios);
      } else {
        console.error("Error al obtener la lista de servicios:", data);
      }
    } catch (error) {
      console.error("Error al obtener la lista de servicios:", error);
    }
  };



  const fetchProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/producto`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      console.log(data)
      if (data && data.productos) {
        setProductos(data.productos);
      } else {
        console.error("Error al obtener la lista de productos:", data);
      }
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error);
    }
  };



  const fetchCitas = async () => {
    try {
      const response = await fetch(`${API_URL}/citas`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const citasResponse = await response.json();
      const citasArray = citasResponse.listCitas;

      const filteredCitas = citasArray.filter((cita) => {
        const citaDate = new Date(cita.Fecha_Atencion);
        citaDate.setDate(citaDate.getDate() + 1);
        const today = new Date();
        const citaDateWithoutTime = new Date(citaDate.getFullYear(), citaDate.getMonth(), citaDate.getDate());
        const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
        return citaDateWithoutTime.getTime() === todayWithoutTime.getTime();
      });
      const responseUsuarios = await axios.get(`${API_URL}/usuario`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      var arrayUsuarios = responseUsuarios.data.usuarios

      const citasConNombreUsuario = filteredCitas.map(cita => {
        const usuario = arrayUsuarios.find(usuario => usuario.id_usuario === cita.id_usuario);
        return {
          ...cita,
          nombre_usuario: usuario ? usuario.nombre_usuario : 'Cliente no encontrado'
        };
      });
  
      setCitas(citasConNombreUsuario);
    } catch (error) {
      console.error('Error al obtener citas:', error);
    }
  };

  

  const fetchVentas = async () => {
    try {
      const data = await VentaService.getVentas();
      if (data && data.ventas) {
        setVentas(data.ventas);
      } else {
        console.error(
          'La respuesta de la API no contiene la propiedad "ventas":',
          data,
        );
      }
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
    }
  };



  const handleClienteChange = (clienteId) => {
    const selected = clientes.find(
      (cliente) => cliente.id_cliente == clienteId,
    );
    if (selected) {
      setSelectedCliente(selected);
      setApellido(selected.apellido);
      setDocumento(selected.documento);
    } else {
      console.error("Cliente no encontrado con el ID:", clienteId);
      console.log(typeof clienteId);
    }
  };


  //usuarios
  const handleUsuarioChage = (usuarioId) => {
    const selected = usuarios.find(
      (usuario) => usuario.id_usuario == usuarioId,
    );
    setSelectedUsuario(selected);
  };


  const handleEmpleadoChange = (empleadoId) => {
    const selected = empleados.find(
      (empleado) => empleado.id_empleado == empleadoId,
    );
    setSelectedEmpleado(selected);
  };



  const handleServicioChange = (servicioId) => {
    const parsedServicioId = parseInt(servicioId, 10);

    if (isNaN(parsedServicioId) || !servicios) {
      console.error(
        "El servicioId no es un número válido o servicios no está definido",
      );
      return;
    }
    console.log(parsedServicioId);

    const selected = servicios.find(
      (servicio) => servicio.id == parsedServicioId,
    );
    setSelectedServicio(selected);
  };



  const handleProductoChange = (productoId) => {
    const selected = productos.find(
      (producto) => producto.nombre == productoId,
    );
    setSelectedProducto(selected);
    console.log(productoId);
  };



  const handleAgregarServicio = () => {
    if (selectedServicio) {
      let precioTotal = selectedServicio.valor * cantidadServicios;
      const nuevaFilaServicio = {
        id: selectedServicio.id,
        nombre: selectedServicio.nombre,
        cantidad: cantidadServicios,
        precioUnitario: selectedServicio.valor,
        precioTotal: precioTotal,
      };
      console.log(nuevaFilaServicio);

      setServiciosEnVenta([...serviciosEnVenta, nuevaFilaServicio]);
      setSelectedServicio(null);

      setTotalVenta(totalVenta + nuevaFilaServicio.precioTotal);
    } else {
      console.error(
        "El servicio seleccionado no tiene un valor de venta válido.",
      );
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
      console.log(nuevaFilaProducto);

      setProductosEnVenta([...productosEnVenta, nuevaFilaProducto]);
      setSelectedProducto(null);

      setTotalVenta(totalVenta + nuevaFilaProducto.precioTotal);
    }
  };



  const handleEliminarServicio = (index) => {
    const nuevasFilas = [...serviciosEnVenta];
    const servicioEliminado = nuevasFilas[index];
    nuevasFilas.splice(index, 1);
    setServiciosEnVenta(nuevasFilas);

    setTotalVenta(totalVenta - servicioEliminado.precioTotal);
  };



  const handleEliminarProducto = (index) => {
    const nuevasFilas = [...productosEnVenta];
    const productoEliminado = nuevasFilas[index];
    nuevasFilas.splice(index, 1);
    setProductosEnVenta(nuevasFilas);

    setTotalVenta(totalVenta - productoEliminado.precioTotal);
  };



  const handleCitaChange = (event) => {
    const selectedUsuario = event.target.value;
    console.log("Número de cédula del cliente:", selectedUsuario);
    setSelectedUsuario(selectedUsuario);
  };



  const handleNumeroCitaTerminado = async (id_usuario) => {
    try {
      //setSelectedCliente(null);
      setSelectedUsuario(null);
      setSelectedEmpleado(null);
      setCitaData(null);
      setServiciosEnVenta([]);
      setTotalVenta(0);
      const citaDataResponse = await fetchCitasData(id_usuario);
      console.log(citaDataResponse)
      await handleUsuarioChage(citaDataResponse?.id_usuario);
      //await handleClienteChange(citaDataResponse?.id_cliente);
      await handleEmpleadoChange(citaDataResponse?.id_empleado);

      let infoServicio;

      try {
        const response = await axios.get(`${API_URL}/citas_servicios/${citaDataResponse.id_cita}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = response.data;
        infoServicio = data;        
      } catch (error) {
        console.error("Error al obtener los datos de la cita:", error);
      }

      const selected = servicios.find(
        (servicio) => servicio?.id == infoServicio?.id_servicio,
      );
      if (selected) {
        const nuevaFilaServicio = {
          id: selected?.id,
          nombre: selected?.nombre,
          cantidad: 1,
          precioUnitario: selected?.valor,
          precioTotal: selected?.valor,
        };
        setServiciosEnVenta([nuevaFilaServicio]);
        setSelectedServicio(null);
        setTotalVenta(nuevaFilaServicio.precioTotal);
        setVisible(false);
      }
    } catch (error) {
      console.error("Error al obtener los datos de la cita:", error);
      throw error;
    }
  };



  const handleMostrarServicio = () => {
    setMostrarServicio(true);
    setMostrarProducto(false);
  };



  const handleMostrarProducto = () => {
    setMostrarProducto(true);
    setMostrarServicio(false);
  };


/*
  const obtenerCedulaCliente = async (id_cliente) => {
    try {
      const response = await fetch(`${API_URL}/cliente/${id_cliente}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener los detalles del cliente');
      }
      
      const clienteData = await response.json();
      const cedulaCliente = clienteData.documento;
      setNumeroCita(cedulaCliente);
      try {
        setSelectedCliente(null);
        setSelectedEmpleado(null);
        setCitaData(null);
        setServiciosEnVenta([]);
        setTotalVenta(0);
  
        const citaDataResponse = await fetchCitasData(cedulaCliente);
        console.log("La cita actual", citaDataResponse);
     
        
        await handleClienteChange(citaDataResponse?.id_cliente);
        await handleEmpleadoChange(citaDataResponse?.id_empleado);
  
        let infoServicio;
  
        try {
          const response = await fetch(
            `${API_URL}/citas_servicios/${citaDataResponse.id_cita}`, {
              headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
            });
          
          const data = await response.json();
          infoServicio = data;
        } catch (error) {
          console.error("Error al obtener los datos de la cita:", error);
        }
  
        const selected = servicios.find(
          (servicio) => servicio?.id == infoServicio?.id_servicio,
        );
        if (selected) {
          const nuevaFilaServicio = {
            id: selected?.id,
            nombre: selected?.nombre,
            cantidad: 1,
            precioUnitario: selected?.valor,
            precioTotal: selected?.valor,
          };
          setServiciosEnVenta([nuevaFilaServicio]);
          setSelectedServicio(null);
          setTotalVenta(nuevaFilaServicio.precioTotal);
        }
      } catch (error) {
        console.error("Error al obtener los datos de la cita:", error);
        throw error;
      }
      setVisible(false);
    } catch (error) {
      console.error('Error al obtener la cédula del cliente:', error);
      return null;
    }
  }; 

*/
  
    const abrirModal = () => {
      setVisible(true);
    };



  const cerrarModal = () => {
      setVisible(false);
  };



  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Crear Venta</strong>
              <CButton onClick={abrirModal}>Pendientes</CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <form>
              <div
                className="mb-3"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <CModal visible={visible} onClose={cerrarModal}>
                  <CModalHeader>
                    <CModalTitle>Seleccionar cita</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CCardBody>
                      <CTable align='middle' className='mb-0 border' hover responsive>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell scope="col">#</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Cliente</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Fecha</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Hora Atención</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {citas && citas.map((citas, index) => (
                            <CTableRow key={citas.id_cita}>
                              <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                              <CTableDataCell>{citas.nombre_usuario}</CTableDataCell>
                              <CTableDataCell>{citas.Fecha_Atencion.slice(0, 10)}</CTableDataCell>
                              <CTableDataCell>{citas.Hora_Atencion}</CTableDataCell>
                              <CTableDataCell>
                                <CButtonGroup aria-label="Basic mixed styles example">
                                  <CButton
                                    size="sm"
                                    onClick={() => {
                                      handleNumeroCitaTerminado(citas.id_usuario)
                                    }}
                                  >
                                    Atender
                                  </CButton>
                                </CButtonGroup>
                              </CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </CCardBody>
                  </CModalBody>
                </CModal>

              </div>
              {errorCedula && (
                <p style={{ color: "red" }}>Cliente no encontrado</p>
              )}
              <div
                className="mb-3"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div style={{ flex: 1, marginRight: "10px" }}>
                  <CFormLabel>Cliente</CFormLabel>
                  <CFormInput
                    value={
                      selectedUsuario != undefined
                        ? selectedUsuario?.nombre_usuario + " " + apellido
                        : " "
                    }
                    readOnly
                  />
                </div>
                <div style={{ flex: 1, marginRight: "10px" }}>
                  <CFormLabel>Fecha y Hora</CFormLabel>
                  <CFormInput
                    value={
                      citaData?.Fecha_Atencion != undefined
                        ? citaData?.Fecha_Atencion.slice(0, 10) +
                        " - " +
                        citaData?.Hora_Atencion
                        : " "
                    }
                    readOnly
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <CFormLabel>Empleado</CFormLabel>
                  <CFormInput
                    value={
                      selectedEmpleado?.nombre == undefined
                        ? " "
                        : selectedEmpleado?.nombre +
                        " " +
                        selectedEmpleado?.apellido
                    }
                    readOnly
                  />
                </div>
              </div>

              <div className="mb-3" style={{ display: "none" }}>
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

              <div>
                <CButton onClick={handleMostrarServicio} style={{ marginRight: "5px" }}>
                  Agregar Servicio
                </CButton>
                <CButton onClick={handleMostrarProducto}>
                  Agregar Producto
                </CButton>

                {mostrarServicio && (
                  <div>
                    <CFormLabel>Agregar Servicios</CFormLabel>
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
                        type="number"
                        name="cantidadServicios"
                        placeholder="Ingrese su cantidad"
                        value={cantidadServicios}
                        onChange={(e) => setCantidadServicios(e.target.value)}
                        style={{ marginLeft: "5px" }}
                      />
                      <CButton
                        color="success"
                        onClick={handleAgregarServicio}
                        style={{ marginLeft: "5px", marginRight: "-6px" }}
                      >
                        +
                      </CButton>
                      </div>
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
              </div>
              <br></br>

              {/* Resto del formulario */}

              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Cantidad</CTableHeaderCell>
                    <CTableHeaderCell scope="col">
                      Precio Unitario
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">
                      Precio Total
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {serviciosEnVenta.map((servicio, index) => (
                    <CTableRow key={index}>
                      <CTableHeaderCell scope="row">
                        {index + 1}
                      </CTableHeaderCell>
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
                      <CTableHeaderCell scope="row">
                        {index + 1}
                      </CTableHeaderCell>
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
              <CButton color="primary" onClick={createSale} style={{ marginRight: "5px" }}>
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

export default CargarVentas;
