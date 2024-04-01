import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import { faEye, faCheckCircle, faBan, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import {
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
  CButton,
  CButtonGroup,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
  CFormInput,
  CPagination,
  CPaginationItem,
  CInputGroup,
} from '@coreui/react';
import AbonoService from 'src/views/services/abonoService';
import VentaService from 'src/views/services/ventasService';

function ListaVentas() {
  const currentLocation = useLocation();
  const [ventas, setVentas] = useState([]);
  const [abonos, setAbonos] = useState([]);
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detalleproductos, setDetalleProducto] = useState(null);
  const [detalleservicios, setDetalleServicio] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [montoAbono, setMontoAbono] = useState(0);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [abonosRealizados, setAbonosRealizados] = useState([]);


  useEffect(() => {
    fetchVentas();
    fetchAbonos();
  }, [currentLocation, currentPage]);

  const fetchAbonos = async () => {
    try {
      const abonos = await AbonoService.getAbonos();
      if (abonos && abonos.length > 0) {
        console.log(abonos);
        setAbonos(abonos);
      } else {
        console.error('La respuesta de la API no contiene los abonos esperados');
      }
    } catch (error) {
      console.error('Error al obtener los abonos:', error);
    }
  };

  const fetchVentas = async () => {
    try {
      const data = await VentaService.getVentas();
      if (data && data.ventas) {
        const ventasWithAbonos = data.ventas.map(venta => {
          const abono = abonos.find(abono => abono.id_ventas === venta.id_ventas);
          if (abono) {
            venta.valor_abonado = abono.precio_agregar;
            venta.fecha_abono = abono.fecha_abono;
          } else {
            venta.valor_abonado = 0;
            venta.fecha_abono = null;
          }
          return venta;
        });
        setVentas(ventasWithAbonos);
      } else {
        console.error('La respuesta de la API no contiene la propiedad "ventas":', data);
      }
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const cancelarVentas = async (id_ventas) => {
    try {
      await VentaService.cancelarVenta(id_ventas);
      fetchVentas();
    } catch (error) {
      console.error('error al cancelar la venta', error);
    }
  };

  // Función para agregar un nuevo abono
  const agregarAbono = () => {
    if (montoAbono > 0) {
      const nuevoAbono = { monto: montoAbono, fecha: new Date() };
      setAbonosRealizados([...abonosRealizados, nuevoAbono]);
      setMontoAbono(0); // Reiniciar el campo de monto de abono
    }
  };

  const CambioAnulado = async (id_ventas) => {
    try {
      await VentaService.cambiarEstado(id_ventas);
      fetchVentas();
    } catch (error) {
      console.error('no deja anular, tenemos un error', error);
    }
  };

  const handleAbono = (venta) => {
    setSelectedVenta(venta);
    setMontoAbono(venta.precio);
    setModalVisible(true);
  };

  const handleSubmitAbono = async () => {
    try {
      const fechaAbono = new Date();
      const idCliente = selectedVenta.id_cliente;
  
      await AbonoService.postAbonos(selectedVenta.id_ventas, idCliente, montoAbono, fechaAbono);
  
      // Actualizar el estado de la lista de ventas después de un abono exitoso
      const updatedVentas = ventas.map(venta => {
        if (venta.id_ventas === selectedVenta.id_ventas) {
          venta.valor_abonado += montoAbono;
          venta.fecha_abono = fechaAbono;
  
          // Verificar si el valor abonado es igual al valor total de la venta
          if (venta.valor_abonado === venta.precio) {
            venta.estado = 'Pagado';
          }
        }
        return venta;
      });
  
      setVentas(updatedVentas);
  
      // Ocultar el modal después de realizar el abono
      setModalVisible(false);
  
      // Mostrar mensaje de éxito con SweetAlert2
      Swal.fire({
        icon: 'success',
        title: '¡Abono realizado con éxito!',
        text: 'El abono se ha registrado correctamente.',
      });
    } catch (error) {
      console.error('Error al enviar el abono:', error);
    }
  };









  function getColorForEstado(estado_anulado) {
    if (estado_anulado === 'Activo') {
      return 'success';
    } else if (estado_anulado === 'Inactivo') {
      return 'danger';
    } else {
      return 'default';
    }
  }

  const filteredVentas = ventas.filter(venta => {
    const ventaEntries = Object.entries(venta);
    for (const [key, value] of ventaEntries) {
      if (typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      if (key === 'numeroFactura' && value.toString().includes(searchTerm)) {
        return true;
      }
      if (typeof value === 'object' && value !== null) {
        const innerEntries = Object.entries(value);
        for (const [innerKey, innerValue] of innerEntries) {
          if (typeof innerValue === 'string' && innerValue.toLowerCase().includes(searchTerm.toLowerCase())) {
            return true;
          }
        }
      }
    }
    return false;
  });

  const indexOfLastVenta = currentPage * pageSize;
  const indexOfFirstVenta = indexOfLastVenta - pageSize;
  const currentVentas = filteredVentas.slice(indexOfFirstVenta, indexOfLastVenta);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Lista de Ventas</strong>
              <div className="d-flex">
                <Link to="/ventas/CrearVentas" style={{ marginRight: '10px' }}>
                  <CButton color="primary">Agregar Ventas</CButton>
                </Link>
                <Link to="/ventas/cargarVentas">
                  <CButton color="primary">Cargar Ventas</CButton>
                </Link>
              </div>
            </div>
            <div className="mt-3">
              <CInputGroup className="mt-3" style={{ maxWidth: "200px" }}>
                <CFormInput
                  type="text"
                  className="form-control-sm"
                  placeholder="Buscar ventas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </div>
          </CCardHeader>
          <CCardBody>
            <CTable align='middle' className='mb-0 border' hover responsive>
              <CTableHead>
                <CTableRow>
                  {/* <CTableHeaderCell scope="col">#</CTableHeaderCell> */}
                  <CTableHeaderCell scope="col">Cliente</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Empleado</CTableHeaderCell>
                  <CTableHeaderCell scope="col">N° Factura</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Valor Total</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Valor Abonado</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Deuda Pendiente</CTableHeaderCell>

                  <CTableHeaderCell scope="col">Fecha Abono</CTableHeaderCell>


                  <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Anular</CTableHeaderCell>
                  <CTableHeaderCell scope="col"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentVentas.map((venta, index) => (
                  <CTableRow key={venta.id_ventas}>
                    {/* <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell> */}
                    <CTableDataCell>{venta.nombre}</CTableDataCell>
                    <CTableDataCell>{venta.nombre_empleado}</CTableDataCell>
                    <CTableDataCell>{venta.numeroFactura}</CTableDataCell>
                    <CTableDataCell>
                      {venta.precio.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </CTableDataCell>
                    <CTableDataCell>{venta.valor_abonado}</CTableDataCell>
                    <CTableDataCell>{venta.precio - venta.valor_abonado}</CTableDataCell>


                    <CTableDataCell>{venta.fecha_abono ? new Date(venta.fecha_abono).toLocaleDateString() : '-'}</CTableDataCell>

                    <CTableDataCell>{venta.estado}</CTableDataCell>
                    <CTableDataCell><CBadge color={getColorForEstado(venta.estado_anulado)}>{venta.estado_anulado}</CBadge></CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup aria-label="Basic mixed styles example">
                        <CButton
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px 12px',
                            border: '1px solid #17a2b8',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(0, 0, 255, 0.2)',
                            color: '#17a2b8',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                          }}
                          color="info"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setVisible(!visible);
                            setDetalleProducto(venta.detalleproductos);
                            setDetalleServicio(venta.detalleservicios);
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} style={{ color: '#000000' }} />
                        </CButton>

                        <div style={{ width: '10px' }} />
                        {venta.estado.toLowerCase() !== 'pagado' && (
                          <CButton
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '8px 12px',
                              border: '1px solid #28a745',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(0, 255, 0, 0.2)',
                              color: '#17a2b8',
                              fontSize: '14px',
                              textTransform: 'uppercase',
                              cursor: 'pointer',
                            }}
                            size="sm"
                            onClick={() => {
                              setModalVisible(!modalVisible);
                              handleAbono(venta);
                            }}
                          >
                            <FontAwesomeIcon icon={faHandHoldingDollar} style={{ color: '#000000' }} />
                          </CButton>
                        )}


                        <div style={{ width: '10px' }} />
                        <CButton
                          color="danger" // Cambia el color del botón a rojo
                          size="sm"
                          variant="outline"
                          onClick={() => CambioAnulado(venta.id_ventas)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                          }}
                        >
                          <FontAwesomeIcon icon={faBan} style={{ color: '#000000' }} />
                        </CButton>
                      </CButtonGroup>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <CModal visible={visible} onClose={() => setVisible(false)} backdrop="static">
              <CModalHeader>
                <CModalTitle>Detalle de Ventas</CModalTitle>
              </CModalHeader>
              <CModalBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {detalleproductos && (
                  <div>
                    <h4>Detalles de Productos</h4>
                    <ul style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
                      {detalleproductos.map((detalle, index) => (

                        <li key={index} style={{
                          listStyle: 'none',
                          marginBottom: '10px',
                          fontSize: '16px',
                          flex: '0 0 auto',
                          minWidth: '200px'
                        }}>
                          <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Nombre:</span> {detalle.nombre}, <br />
                          <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Cantidad:</span> {detalle.cantidad}, <br />
                          <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Precio Unitario:</span> {detalle.valor_venta}, <br />
                          <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Valor Total:</span> {detalle.valor_total}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <br />
                {detalleservicios && (
                  <div>
                    <h4>Detalles de Servicios</h4>
                    <ul style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
                      {detalleservicios.map((detalle, index) => (
                        <li key={index} style={{
                          listStyle: 'none',
                          marginBottom: '10px',
                          fontSize: '16px',
                          flex: '0 0 auto',
                          minWidth: '200px'
                        }}>
                          <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Nombre:</span>{detalle.nombre}, <br />
                          <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Cantidad:</span>{detalle.cantidad}, <br />
                          <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Precio Unitario:</span>{detalle.valor_venta}, <br />
                          <span style={{ fontWeight: 'bold', marginRight: '5px' }}>Valor Total:</span>{detalle.valor_total}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CModalBody>
            </CModal>


            <CModal visible={modalVisible} onClose={() => setModalVisible(false)} backdrop="static">
              <CModalHeader>
                <CModalTitle>Abonos</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <p>Deuda total: ${selectedVenta && (selectedVenta.precio - selectedVenta.valor_abonado)}</p>
                <p>Valor Abonado: ${selectedVenta && selectedVenta.valor_abonado}</p>
                <CInputGroup className="mb-3">
                  <CFormInput
                    type="number"
                    placeholder="Ingrese el monto a abonar"
                    value={montoAbono}
                    onChange={(e) => setMontoAbono(parseFloat(e.target.value))}
                  />
                </CInputGroup>
                <p>Fecha: {new Date().toLocaleDateString()}</p>
              </CModalBody>
              <CModalFooter>
                <CButton color="primary" onClick={handleSubmitAbono}>Confirmar Abono</CButton>
                <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancelar</CButton>
              </CModalFooter>
            </CModal>





            <CPagination align="center" aria-label="Page navigation example" className="mt-3">
              <CPaginationItem onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Anterior
              </CPaginationItem>
              {Array.from({ length: Math.ceil(filteredVentas.length / pageSize) }, (_, i) => (
                <CPaginationItem
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  active={i + 1 === currentPage}
                >
                  {i + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredVentas.length / pageSize)}
              >
                Siguiente
              </CPaginationItem>
            </CPagination>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ListaVentas;