import React, { useState, useEffect } from "react";
import CitasDataService from "src/views/services/citasService";
import Servicios_S from "src/views/services/servicios_s";
import Swal from 'sweetalert2';
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import { ta } from "date-fns/locale";

function ListaCitas() {
  const [visible, setVisible] = useState(false);
  const [citas, setCitas] = useState([]);
  const [detallesCita, setDetallesCita] = useState([]); // 
  const [tablaActualizada, setTablaActualizada] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CitasDataService.getAllCitasServicios();

        const citasConDetalle = await Promise.all(
          response.data.map(async (item) => {
            const cita = {
              id_cita: item.cita.id_cita,
              id_empleado: item.cita.id_empleado,
              id_cliente: item.cita.id_cliente,
              Fecha_Atencion: item.cita.Fecha_Atencion,
              Hora_Atencion: item.cita.Hora_Atencion,
              estado: item.cita.estado,
            };

            const detallesCita = await Promise.all(
              item.citaServicio.map(async (detalle) => {
                try {
                  const response = await Servicios_S.get(detalle.id_servicio);
                  return {
                    id_servicio: detalle.id_servicio,
                    servicioInfo: response.data,
                  };
                } catch (error) {
                  console.error(
                    `Error obteniendo detalles del servicio con ID ${detalle.id_servicio}:`,
                    error,
                  );
                  return {
                    id_servicio: detalle.id_servicio,
                    servicioInfo: null,
                  };
                }
              }),
            );

            return {
              cita,
              detallesCita,
            };
          }),
        );

        setCitas(citasConDetalle);
      } catch (error) {
        console.error("Error al obtener citas:", error);
        // Puedes manejar el error según tus necesidades
      }
    };

    fetchData();
  }, [tablaActualizada]);

  const cancelarCita = async (idCita) => {
    try {
      await CitasDataService.cambiarEstadoCita(idCita);

      setTablaActualizada(true);
      Swal.fire('Éxito', 'La cita se ha cancelado exitosamente', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo realizar el pago', 'error');
    }
  }

  const mostrarDetalleCompra = (cita) => {
    setVisible(true);
    // Mueve la declaración de detallesCita aquí
    setDetallesCita(cita.detallesCita);
  };

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Lista de citas</CCardHeader>
            <CCardBody>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">empleado</CTableHeaderCell>
                    <CTableHeaderCell scope="col">
                      Fecha de Atencion
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">
                      Hora de Atencion{" "}
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Accion</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {citas.map((cita, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell>{cita.cita.id_empleado}</CTableDataCell>
                      <CTableDataCell>
                        {cita.cita.Fecha_Atencion}
                      </CTableDataCell>
                      <CTableDataCell>{cita.cita.Hora_Atencion}</CTableDataCell>
                      <CTableDataCell>{cita.cita.estado}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          onClick={() => mostrarDetalleCompra(cita)}
                        >
                          DETALLE
                        </CButton>
                        <CButton
                          color="danger"
                          onClick={() => cancelarCita(cita.cita.id_cita)}
                        >
                          CANCELAR
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
              >
                <CModalHeader onClose={() => setVisible(false)}>
                  <CModalTitle id="LiveDemoExampleLabel">
                    Detalle Cita
                  </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CTable>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">
                          ID Servicio
                        </CTableHeaderCell>
                        {/* Ajusta aquí según la estructura de los datos del servicio */}
                        <CTableHeaderCell scope="col">
                          Nombre Servicio
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">Valor</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {detallesCita.map((detalle, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{detalle.id_servicio}</CTableDataCell>
                          {/* Ajusta aquí según la estructura de los datos del servicio */}
                          <CTableDataCell>
                            {detalle.servicioInfo
                              ? detalle.servicioInfo.nombre
                              : "N/A"}
                          </CTableDataCell>
                          <CTableDataCell>
                            {detalle.servicioInfo
                              ? detalle.servicioInfo.valor
                              : "N/A"}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setVisible(false)}>
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
}

export default ListaCitas;
