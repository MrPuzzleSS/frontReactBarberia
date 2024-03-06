import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheckCircle, faBan } from '@fortawesome/free-solid-svg-icons';
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
import VentaService from 'src/views/services/ventasService';

function ListaVentas() {
  const currentLocation = useLocation();
  const [ventas, setVentas] = useState([]);
  const [visible, setVisible] = useState(false);
  const [detalleproductos, setDetalleProducto] = useState(null);
  const [detalleservicios, setDetalleServicio] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVentas();
  }, [currentLocation, currentPage]);

  const fetchVentas = async () => {
    try {
      const data = await VentaService.getVentas();
      if (data && data.ventas) {
        console.log(data.ventas);
        setVentas(data.ventas);
      } else {
        console.error('La respuesta de la API no contiene la propiedad "ventas":', data);
      }
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
    }
  };

  const indexOfLastVenta = currentPage * pageSize;
  const indexOfFirstVenta = indexOfLastVenta - pageSize;
  const currentVentas = ventas.slice(indexOfFirstVenta, indexOfLastVenta);

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

  const CambioAnulado = async (id_ventas) => {
    try {
      await VentaService.cambiarEstado(id_ventas);
      fetchVentas();
    } catch (error) {
      console.error('no deja anular, tenemos un error', error);
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
    // Convertir el objeto de venta en una matriz de pares clave-valor
    const ventaEntries = Object.entries(venta);
    
    // Iterar sobre cada par clave-valor
    for (const [key, value] of ventaEntries) {
      // Verificar si el valor es una cadena de texto y si incluye el término de búsqueda
      if (typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      // Verificar específicamente el número de factura
      if (key === 'numeroFactura' && value.toString().includes(searchTerm)) {
        return true;
      }
      // Verificar si el valor es un objeto y buscar en sus campos internos si es una cadena de texto
      if (typeof value === 'object' && value !== null) {
        const innerEntries = Object.entries(value);
        for (const [innerKey, innerValue] of innerEntries) {
          if (typeof innerValue === 'string' && innerValue.toLowerCase().includes(searchTerm.toLowerCase())) {
            return true;
          }
        }
      }
    }
    
    return false; // Si no se encuentra ninguna coincidencia, devolver false
  });

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Lista de Ventas</strong>
              <Link to="/ventas/CrearVentas">
                <CButton color="primary">Agregar Ventas</CButton>
              </Link>
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
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Cliente</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Empleado</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nro° Factura</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Valor Total</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Anular</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredVentas && filteredVentas.map((venta, index) => (
                  <CTableRow key={venta.id_ventas}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{venta.nombre}</CTableDataCell>
                    <CTableDataCell>{venta.nombre_empleado}</CTableDataCell>
                    <CTableDataCell>{venta.numeroFactura}</CTableDataCell>
                    <CTableDataCell>{venta.precio}</CTableDataCell>
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
                            backgroundColor: 'transparent',
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
                          <FontAwesomeIcon icon={faEye} />

                        </CButton>
                        <div style={{ width: '10px' }} />
                        {venta.estado.toLowerCase() !== 'cancelado' && ( // Mostrar solo si el estado no es 'cancelado'
                          <CButton
                            color="success"
                            size="sm"
                            variant="outline"
                            onClick={() => cancelarVentas(venta.id_ventas)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} /> Cancelar
                          </CButton>
                        )}

                        <div style={{ width: '10px' }} />
                        <CButton
                          color="warning"
                          size="sm"
                          variant="outline"
                          onClick={() => CambioAnulado(venta.id_ventas)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            backgroundColor: 'transparent',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                          }}
                        >
                          <FontAwesomeIcon icon={faBan} style={{ marginRight: '5px' }} />
                        </CButton>
                      </CButtonGroup>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CPagination align="center" aria-label="Page navigation example" className="mt-3">
              <CPaginationItem onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Anterior
              </CPaginationItem>
              {Array.from({ length: Math.ceil(ventas.length / pageSize) }, (_, i) => (
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
                disabled={currentPage === Math.ceil(ventas.length / pageSize)}
              >
                Siguiente
              </CPaginationItem>
            </CPagination>
          </CCardBody>
        </CCard>
      </CCol>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Detalle de Ventas</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {detalleproductos && (
            <div>
              <h4>Detalles de Productos</h4>
              <ul>
                {detalleproductos.map((detalle, index) => (

                  <li key={index}>
                    IdDetalleProducto: {detalle.id_detalleproducto}, IdVenta: {detalle.id_ventas}, IdProducto: {detalle.id_producto}, Cantidad: {detalle.cantidad}, Precio Unitario: {detalle.valor_venta}, Valor Total: {detalle.valor_total}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {detalleservicios && (
            <div>
              <h4>Detalles de Servicios</h4>
              <ul>
                {detalleservicios.map((detalle, index) => (
                  <li key={index}>
                    IdDetalleServicio: {detalle.id_detalleservicio}, IdVenta: {detalle.id_ventas}, IdServicio: {detalle.id_servicio}, Cantidad: {detalle.cantidad}, Valor Venta: {detalle.valor_venta}, Valor Total: {detalle.valor_total}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default ListaVentas;