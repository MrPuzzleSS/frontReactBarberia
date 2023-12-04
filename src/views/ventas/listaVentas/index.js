import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
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
} from '@coreui/react';
import VentaService from 'src/views/services/ventasService';

function ListaVentas() {
  const [ventas, setVentas] = useState ([]);
  const [visible, setVisible] = useState(false);
  const [selectedVentaId, setSelectedVentaId] = useState ({});

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

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Lista de Ventas</strong>
              <Link to="se pone el link.....">
              <CButton color="primary">Agregar Ventas</CButton>
              </Link>
            </div>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Cliente</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Empleado</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nro° Factura</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Valor Total</CTableHeaderCell>
                  <CTableHeaderCell scope="col">estado</CTableHeaderCell>
                  <CTableHeaderCell scope="col">acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {ventas && ventas.map((venta, index) => (
                  <CTableRow key={venta.id_ventas}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{venta.nombre}</CTableDataCell>
                    <CTableDataCell>{venta.id_empleado}</CTableDataCell>
                    <CTableDataCell>{venta.numeroFactura}</CTableDataCell>
                    <CTableDataCell>{venta.precio}</CTableDataCell>
                    <CTableDataCell>{venta.estado}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup aria-label="Basic mixed styles example">
                        <CButton
                          color="info"
                          size="sm"
                          variant="outline"
                          onClick={() => setVisible(!visible)}
                        >
                          Detalle 
                        </CButton>
                        <CButton color="warning" size="sm" variant="outline">
                          Cambiar Estado
                        </CButton>
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
          <form>
            <div className="mb-3">
              <CFormLabel>IdProducto: 4</CFormLabel>
            </div>
            <div className="mb-3">
              <CFormLabel>Cantidad: 3</CFormLabel>
            </div>
            <div className="mb-3">
              <CFormLabel>Valor Venta: 70.000</CFormLabel>
            </div>
            <div className="mb-3">
              <CFormLabel>Valor Total: 210.000</CFormLabel>
            </div>
            <div className="mb-3">
              <CFormLabel>Tipo de Venta: Productos</CFormLabel>
            </div>
          </form>
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
