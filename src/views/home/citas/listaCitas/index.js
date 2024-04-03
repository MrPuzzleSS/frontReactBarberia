import React, { useState, useEffect } from "react";
import CitasDataService from "src/views/services/citasService";
import Servicios_S from "src/views/services/servicios_s";
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import 'src/scss/css/global.css'; 
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
import PropTypes from 'prop-types'; // Importa PropTypes
import { getUserInfo } from '../../../../components/auht';

async function getNombreBarbero(id_empleado) {
  try {
    const response = await CitasDataService.getEmpleado(id_empleado);
    return response.data.nombre;
  } catch (error) {
    console.error(`Error obteniendo el nombre del empleado con ID ${id_empleado}:`, error);
    return "Nombre no disponible";
  }
}

function BarberoNombre({ id_empleado }) {
  const [nombre, setNombre] = useState(null);

  useEffect(() => {
    const fetchDataNombre = async () => {
      const nombre = await getNombreBarbero(id_empleado);
      setNombre(nombre);
    };

    fetchDataNombre();

  }, [id_empleado]);

  return <>{nombre}</>;
}

BarberoNombre.propTypes = {
  id_empleado: PropTypes.number.isRequired
}

function ListaCitas() {
  const [visible, setVisible] = useState(false);
  const [citas, setCitas] = useState([]);
  const [detallesCita, setDetallesCita] = useState([]); // 
  const [tablaActualizada, setTablaActualizada] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await getUserInfo();

        const response = await CitasDataService.getAllCitasServicios(userInfo.userId);

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
    // Mostrar un cuadro de diálogo de confirmación
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Realmente quieres cancelar esta cita?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar cita',
      cancelButtonText: 'No, mantener cita'
    });

    // Si el usuario confirma la cancelación
    if (confirmacion.isConfirmed) {
      try {
        // Llamar a la función para cambiar el estado de la cita
        await CitasDataService.cambiarEstadoCita(idCita);

        // Actualizar la tabla
        setTablaActualizada(true);

        // Mostrar mensaje de éxito
        Swal.fire('Éxito', 'La cita se ha cancelado exitosamente', 'success');
      } catch (error) {
        // Si ocurre un error, mostrar un mensaje de error
        Swal.fire('Error', 'No se pudo cancelar la cita', 'error');
      }
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
                    <CTableHeaderCell scope="col">Barbero</CTableHeaderCell>
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
                      <CTableDataCell><BarberoNombre id_empleado={cita.cita.id_empleado} /></CTableDataCell>
                      <CTableDataCell>
                        {format(new Date(cita.cita.Fecha_Atencion), 'dd-MM-yyyy')}
                      </CTableDataCell>
                      <CTableDataCell>{cita.cita.Hora_Atencion}</CTableDataCell>
                      <CTableDataCell>{cita.cita.estado}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          onClick={() => mostrarDetalleCompra(cita)}
                        >
                          Detalle
                        </CButton>
                        <CButton
                          color="danger"
                          disabled={cita.cita.estado === 'Cancelada'} // Deshabilitar si el estado es "Cancelada"
                          onClick={() => cancelarCita(cita.cita.id_cita, cita.cita.estado)}
                        >
                          Cancelar
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
