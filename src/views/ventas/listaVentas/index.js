import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCheckCircle, faBan } from '@fortawesome/free-solid-svg-icons';
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
  CFormLabel,
  CFormSelect,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CBadge,
} from '@coreui/react';
import VentaService from 'src/views/services/ventasService';

function ListaVentas() {
  const [ventas, setVentas] = useState ([]);
  const [visible, setVisible] = useState(false);
  const [selectedVentaId, setSelectedVentaId] = useState ({});
  const [detalleproductos, setDetalleProducto] = useState(null);
  const [detalleservicios, setDetalleServicio] = useState(null);

  useEffect(() => {
    fetchVentas();
  }, []);

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

  const cancelarVentas = async (id_ventas) => {
    try{
      await VentaService.cancelarVenta(id_ventas);
      fetchVentas();
    } catch (error) {
      console.error('error al cancelar la venta', error);
    }
  };

  const CambioAnulado = async (id_ventas) => {
    try{
      await VentaService.cambiarEstado(id_ventas);
      fetchVentas();
    } catch (error) {
      console.error('no deja anular, tenemos un error', error);
    }
  };

  function getColorForEstado(estado_anulado) {
    if (estado_anulado === "Activo") {
      return "success";
    } else if (estado_anulado === "Inactivo") {
      return "danger";
    } else {
      return "default";
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Lista de Ventas</strong>
              <Link to="/ventas/CrearVentas">
              <CButton color="success">Agregar Ventas</CButton>
              </Link>
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
                {ventas && ventas.map((venta, index) => (
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
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                          <FontAwesomeIcon icon={faBook} />
                        </CButton>
                        <div style={{ width: '10px' }} />
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
              
                        <div style={{ width: '10px' }} />
                        <CButton
                        color="warning" 
                        size="sm" 
                        variant="outline"
                        onClick={() => CambioAnulado(venta.id_ventas)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          }}
                        >
                          <FontAwesomeIcon icon={faBan} style={{ marginRight: '5px' }} />
                        </CButton>
                        </div>
                      </CButtonGroup>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
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
                    IdDetalleProducto: {detalle.id_detalleproducto}, IdVenta: {detalle.id_ventas}, IdProducto: {detalle.id_producto}, Cantidad: {detalle.cantidad}, Valor Venta: {detalle.valor_venta}, Valor Total: {detalle.valor_total}
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

export default ListaVentas
