import React, { useState, useEffect } from "react";
import {
  CContainer,
  CCard,
  CCardBody,
  CCardTitle,
  CRow,
  CCol,
  CButton,
  CPagination,
  CPaginationItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CAlert,
  CCardText,
} from "@coreui/react";
import Servicios_S from "src/views/services/servicios_s";
import ServicioBarbero from "src/views/services/empleado_agenda";
import { format, parse, isAfter, isSameDay } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // for selectable
import CitasDataService from "src/views/services/citasService";
import CitasServiciosDataService from "src/views/services/citasServiciosService";
import Swal from 'sweetalert2'
import { getUserInfo } from '../../../../components/auht';
import 'src/scss/css/stylosFullCalendar.css';

const AgendarCita = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleLg, setVisibleLg] = useState(false);
  const [showAgendarButton, setShowAgendarButton] = useState(currentPage !== 3);
  const [servicesData, setServicesData] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [tempSelectedServices, setTempSelectedServices] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [selectedBarbero, setSelectedBarbero] = useState(null);
  const [selectedBarberoId, setSelectedBarberoId] = useState(null);
  const [agendaData, setAgendaData] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedBarberoName, setSelectedBarberoName] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalHoraVisible, setModalHoraVisible] = useState(false);
  const [citasAgendadas, setCitasAgendadasData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesResponse = await Servicios_S.getAll();
        setServicesData(servicesResponse.data.listServicios);

        const empleadosResponse = await ServicioBarbero.getAll();
        const nestedArray =
          empleadosResponse.data && empleadosResponse.data.empleados;

        if (Array.isArray(nestedArray)) {
          setEmpleados(nestedArray);
        } else {
          console.error(
            "Error: La respuesta no contiene un array de proveedores",
            empleadosResponse.data,
          );
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setShowAgendarButton(newPage !== 3);
  };
  const handleDateSelect = (info) => {
    const date = info.start;
    const today = new Date(); // Obtener la fecha de hoy

    // Formatear las fechas
    const formattedDate = format(date, "yyyy-MM-dd");
    const formattedToday = format(today, "yyyy-MM-dd");

    // Dentro de la función handleDateSelect, después de establecer la fecha y antes de mostrar el modal de hora
    setSelectedDate(formattedDate);

    // Asegúrate de que esta línea esté presente
    setModalHoraVisible(true);

    // Llama a calculateAppointmentTime para actualizar el tiempo total de la cita
    calculateAppointmentTime(); // Agrega esta línea

    // Convertir las fechas formateadas en objetos de fecha
    const selectedDateObj = new Date(formattedDate);
    const todayObj = new Date(formattedToday);

    // Verificar si la fecha seleccionada es igual o posterior a la fecha de hoy
    if (isAfter(selectedDateObj, todayObj) || isSameDay(selectedDateObj, todayObj)) {
      // Si la fecha seleccionada es igual o posterior a la fecha de hoy
      setSelectedDate(formattedDate);
      setModalHoraVisible(true);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al Seleccionar la Fecha",
        text: "La fecha seleccionada debe ser igual o posterior a la fecha de hoy!",
      });
    }
  };

  const handleAgendarClick = async () => {
    const userInfo = await getUserInfo();

    if (selectedBarberoId && selectedDate && selectedHour) {
    
      // Parsea la cadena de hora a un objeto de fecha
      const parsedHour = parse(selectedHour, "HH:mm:ss", new Date());
    
      // Formatea la hora en formato HH:mm
      const formattedHour = format(parsedHour, "HH:mm");

      // Guarda la cita al hacer clic en "Agendar"
      const nuevaCita = {
        id_empleado: selectedBarberoId,
        id_usuario: userInfo.userId, // TODO: Obtener el id del cliente
        Fecha_Atencion: selectedDate,
        Hora_Atencion: formattedHour,
      };

      try {
        // Verifica si hay suficiente tiempo disponible en la agenda del empleado
        const enoughTimeAvailable = checkTimeAvailability();

        if (enoughTimeAvailable) {
          // Utiliza la función create de CitasDataService para crear la cita
          const response = await CitasDataService.create(nuevaCita);
          const idCita = response.data.id_cita;

          // Utiliza la función create de CitasServiciosDataService para crear la cita_servicio
          await CitasServiciosDataService.create(citaServicio);

          if(response) {
            Swal.fire({
              icon: "success",
              title: "Se creo la cita correctamente",
              showConfirmButton: false,
            }).then(() => {
              window.location.href = "/cliente/listacitas";
            }, 1500);
          }
        }

      } catch (error) {
        console.error("Error al intentar agendar la cita:", error);
        // Puedes manejar el error según tus necesidades, mostrar un mensaje, etc.
      }
    } else {
      console.warn(
        "Completa la selección de empleado, fecha y hora antes de agendar",
      );

      // Puedes mostrar un mensaje o realizar alguna acción adicional aquí
    }
  };

  const checkTimeAvailability = () => {
  // Obtén el tiempo total de la cita
  const totalAppointmentTime = calculateAppointmentTime();

  // Filtra las citas en agendaData que coinciden con la fecha seleccionada
  const citasParaFecha = agendaData.filter(cita => cita.Fecha_Atencion === selectedDate);

  // Si no hay citas para esta fecha, asumimos que toda la agenda está disponible
  if (citasParaFecha.length === 0) {
    console.log("No hay citas programadas para esta fecha, toda la agenda está disponible.");
    return true;
  }

  // Mapea las horas de inicio de las citas filtradas
  const horasInicio = citasParaFecha.map(cita => cita.Hora_Atencion);

  // Ordena las horas de inicio de las citas
  horasInicio.sort();

  // Calcula la duración entre citas consecutivas para encontrar el intervalo más largo
  let maxInterval = 0;
  for (let i = 1; i < horasInicio.length; i++) {
    const intervalo = getIntervalDuration(horasInicio[i - 1], horasInicio[i]);
    maxInterval = Math.max(maxInterval, intervalo);
  }

  // Calcula el tiempo restante disponible en la agenda del empleado
  const totalAvailableTime = maxInterval;

  console.log("Total Appointment Time:", totalAppointmentTime);
  console.log("Max Available Interval:", maxInterval);

  // Retorna true si hay suficiente tiempo disponible, de lo contrario retorna false
  return totalAvailableTime >= totalAppointmentTime;
};

// Función para calcular la duración entre dos horas en formato HH:mm
const getIntervalDuration = (start, end) => {
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  return endTotalMinutes - startTotalMinutes;
};






  const handleAcceptButtonClick = () => {
    setTempSelectedServices(selectedServices);
    setVisibleLg(false);
  };



  const handleServiceSelection = (service) => {
    const isSelected = selectedServices.some((s) => s.id === service.id);

    // Guarda tanto el nombre como la duración del servicio seleccionado
    const selectedService = {
      id: service.id,
      nombre: service.nombre,
      valor: service.valor,
      tiempo: service.tiempo
    };

    setSelectedServices((prevSelectedServices) =>
      isSelected
        ? prevSelectedServices.filter((s) => s.id !== service.id)
        : [...prevSelectedServices, selectedService],
    );

    // Actualiza la duración total de los servicios seleccionados
    setSelectedServicesDuration((prevDuration) =>
      isSelected
        ? prevDuration - parseInt(service.tiempo) // Resta la duración del servicio
        : prevDuration + parseInt(service.tiempo), // Suma la duración del servicio
    );

    calculateAppointmentTime();
    console.log("Servicio seleccionado:", selectedService);

  };




  // Función para calcular el tiempo total de la cita
  const calculateAppointmentTime = () => {
    // Inicializa el tiempo total de la cita como 0
    let totalAppointmentTime = 0;

    // Recorre todos los servicios seleccionados
    selectedServices.forEach((service) => {
      // Suma la duración de cada servicio al tiempo total de la cita
      totalAppointmentTime += parseInt(service.tiempo);
    });

    console.log("Total Appointment Time:", totalAppointmentTime);

    // Retorna el tiempo total de la cita
    return totalAppointmentTime;
  };


  const handleBarberoSelection = async (id_empleado) => {
    setSelectedBarberoId(id_empleado);

    try {
      const citasAgendadas = await CitasDataService.getAllCitasAgendadas();

      const response = await CitasDataService.getEmpleadoAgendas(id_empleado);
      setSelectedBarbero(response.data.empleado);
      setAgendaData(response.data.agendas);
      console.log(response.data.agendas);
      setCitasAgendadasData(citasAgendadas.data.listCitas);


      // Obtener y almacenar el nombre del empleado
      const empleadoSeleccionado = empleados.find(
        (empleado) => empleado.id_empleado === id_empleado,
      );
      if (empleadoSeleccionado) {
        setSelectedBarberoName(empleadoSeleccionado.nombre);
      }
    } catch (error) {
      console.error("Error al obtener la agenda del empleado:", error);
    }

    handlePageChange(currentPage + 1);
  };

  const generateHourOptions = (startHour, endHour, fechaInicio, citasAgendadas) => {
    const options = [];
    const start = parseInt(startHour.split(":")[0]); // Extract start hour
    const end = parseInt(endHour.split(":")[0]); // Extract end hour

    // Formatear la fecha de inicio

    for (let i = start; i <= end; i++) {
      let hour = i % 12 === 0 ? 12 : i % 12; // Convert hour to 12-hour format
      let suffix = i < 12 ? "AM" : "PM"; // Determine if it's AM or PM
      const hora = `${hour}:00 ${suffix}`;

      // Reformate the hour to match the format of scheduled appointments
      const formattedHora = `${hour < 10 ? '0' + hour : hour}:00:00`;

      // Check if the hour is occupied by a scheduled appointment
      const horaOcupada = citasAgendadas.some(cita => {
        // Ajuste de la zona horaria
        const citaDate = new Date(cita.Fecha_Atencion);
        citaDate.setTime(citaDate.getTime() + citaDate.getTimezoneOffset() * 60 * 1000); // Ajuste de la zona horaria
        const formattedCitaDate = format(citaDate, 'yyyy-MM-dd');
        console.log(formattedCitaDate);
        return formattedCitaDate === selectedDate && cita.Hora_Atencion === formattedHora;
      });

      // If the hour is not occupied, add it to the options
      if (!horaOcupada) {
        options.push(
          <option key={formattedHora} value={formattedHora}>{hora}</option>
        );
      } else {
        // Si la hora está reservada, la añade a las opciones deshabilitada
        options.push(
          <option key={i} value={hora} disabled>{hora} (Reservada)</option>
        );
      }
    }
    return options;
  };



  return (
    <CContainer>
      <h3 className="text-center">RESERVAR CITA</h3>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <CPagination align="center" aria-label="Page navigation example">
                <CPaginationItem
                  active={currentPage === 1}
                  onClick={() => handlePageChange(1)}
                >
                  1. Servicio
                </CPaginationItem>
                <CPaginationItem
                  active={currentPage === 2}
                  onClick={() => handlePageChange(2)}
                >
                  2. Barbero
                </CPaginationItem>
                <CPaginationItem
                  active={currentPage === 3}
                  onClick={() => handlePageChange(3)}
                >
                  3. Fecha y Hora
                </CPaginationItem>
              </CPagination>

              <CCardTitle>
                {currentPage === 1 && "Selecciona un Servicio"}
                {currentPage === 2 && "Selecciona un Barbero"}
                {currentPage === 3 && "Selecciona Fecha y Hora"}
              </CCardTitle>

              {currentPage === 1 && (
                <>
                  <CButton onClick={() => setVisibleLg(!visibleLg)}>
                    Seleccionar Servicios
                  </CButton>

                  {/* Contenido para seleccionar servicios */}
                  {tempSelectedServices.length > 0 ? (
                    <CCard className="mt-3">
                      <CCardBody>
                        <CCardTitle>Servicios Seleccionados</CCardTitle>
                        <CTable>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell scope="col">#</CTableHeaderCell>
                              <CTableHeaderCell scope="col">
                                Nombre
                              </CTableHeaderCell>
                              <CTableHeaderCell scope="col">
                                Valor
                              </CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {tempSelectedServices.map((service, index) => (
                              <CTableRow key={index}>
                                <CTableDataCell>{index + 1}</CTableDataCell>
                                <CTableDataCell>
                                  {service.nombre}
                                </CTableDataCell>
                                <CTableDataCell>{service.valor}</CTableDataCell>
                              </CTableRow>
                            ))}
                          </CTableBody>
                        </CTable>
                      </CCardBody>
                    </CCard>
                  ) : (
                    <div className="mt-3">
                      <CAlert color="info">
                        No se han seleccionado servicios.
                      </CAlert>
                    </div>
                  )}

                  {/* Modal para seleccionar servicios */}
                  <CModal
                    size="lg"
                    scrollable
                    visible={visibleLg}
                    onClose={() => setVisibleLg(false)}
                    aria-labelledby="ScrollingLongContentExampleLabel2"
                  >
                    <CModalHeader>
                      <CModalTitle id="ScrollingLongContentExampleLabel2">
                        Seleciona los servicios
                      </CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                      <CTable>
                        <CTableHead>
                          <CTableRow></CTableRow>
                        </CTableHead>
                        <CTableBody>
                          <tr>
                            {servicesData.map((service) => (
                              <td
                                key={service.id}
                                style={{
                                  padding: "8px",
                                  border: selectedServices.some(
                                    (s) => s.id === service.id,
                                  )
                                    ? "2px solid #007bff"
                                    : "1px solid #ddd",
                                }}
                              >
                                <div style={{ width: "10rem" }}>
                                  <div
                                    style={{
                                      borderBottom: "1px solid #ddd",
                                      padding: "8px",
                                    }}
                                  >
                                    {service.nombre}
                                  </div>
                                  <div style={{ padding: "8px" }}>
                                    Precio: {service.valor}
                                  </div>
                                  <button
                                    style={{
                                      backgroundColor: selectedServices.some(
                                        (s) => s.id === service.id,
                                      )
                                        ? "#007bff"
                                        : "#4caf50",
                                      color: "#fff",
                                      padding: "8px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleServiceSelection(service)
                                    }
                                  >
                                    Seleccionar
                                  </button>
                                </div>
                              </td>
                            ))}
                          </tr>
                        </CTableBody>
                      </CTable>
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        color="secondary"
                        onClick={() => setVisibleLg(false)}
                      >
                        Cancelar
                      </CButton>
                      <CButton
                        color="primary"
                        onClick={handleAcceptButtonClick}
                      >
                        Aceptar
                      </CButton>
                    </CModalFooter>
                  </CModal>
                </>
              )}

              {currentPage === 2 && (
                <>
                  <CContainer>
                    <h3>Barberos Disponibles</h3>
                    {empleados.length > 0 ? (
                      <CRow>
                        {empleados.map((empleado, index) => (
                          <CCol key={index} sm="4">
                            <CCard
                              onClick={() =>
                                handleBarberoSelection(empleado.id_empleado)
                              }
                              style={{
                                cursor: "pointer",
                                border:
                                  selectedBarbero === empleado
                                    ? "2px solid #007bff"
                                    : "1px solid #ddd",
                              }}
                            >
                              <CCardBody>
                                <CCardTitle>{empleado.nombre}</CCardTitle>
                              </CCardBody>
                            </CCard>
                          </CCol>
                        ))}
                      </CRow>
                    ) : (
                      <div className="mt-3">
                        <CAlert color="info">
                          No hay datos de agenda disponibles.
                        </CAlert>
                      </div>
                    )}
                  </CContainer>
                </>
              )}

              {currentPage === 3 && (
                <>
                  <CCard>
                    <CCardBody>
                      <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        initialDate={new Date()} // Establece la fecha inicial en la fecha de hoy
                        selectable={true}
                        select={(info) => handleDateSelect(info)}
                        events={agendaData.map((agendaItem, index) => ({
                          title: "Disponible",
                          start: agendaItem.fechaInicio,
                          end: agendaItem.fechaFin,
                          color: "#28a745",
                          textColor: "#fff",
                          allDay: false,
                          editable: false,
                          selectable: true,
                        }))} />


                      <CModal
                        visible={modalHoraVisible}
                        onClose={() => setModalHoraVisible(false)}
                        aria-labelledby="LiveDemoExampleLabel"
                      >
                        <CModalHeader
                          onClose={() => setModalHoraVisible(false)}
                        >
                          <CModalTitle id="LiveDemoExampleLabel">
                            Selecciona una Hora
                          </CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                          <CModalBody>
                            {agendaData && agendaData.length > 0 && (
                              <div>
                                <h4>Horas para el día {selectedDate}</h4>
                                <select onChange={(e) => setSelectedHour(e.target.value)}>
                                  {generateHourOptions(
                                    agendaData[0].horaInicio,
                                    agendaData[0].horaFin,
                                    selectedDate, // Pasar la fecha de inicio como argumento
                                    citasAgendadas
                                  )}
                                </select>
                              </div>
                            )}

                          </CModalBody>
                        </CModalBody>
                        <CModalFooter></CModalFooter>
                      </CModal>
                    </CCardBody>
                  </CCard>
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={4}>
          <CCard>
            <CCardBody>
              <CCardTitle className="text-center">
                Información de tus Servicios
              </CCardTitle>
              <CCardText>
                {selectedBarberoId && selectedDate && selectedHour ? (
                  <div>
                    <p>
                      <strong>Empleado:</strong> {selectedBarberoName} <br />
                      <strong>Fecha:</strong> {selectedDate} <br />
                      <strong>Hora:</strong> {selectedHour} <br />
                      <strong>Servicios:</strong>
                    </p>
                    <ul>
                      {tempSelectedServices.map((service, index) => (
                        <li key={index}>
                          {service.nombre} <br />
                          <strong style={{ display: "inline-block", width: "45px" }}>Valor:</strong> ${service.valor.toLocaleString()}
                        </li>
                      ))}
                    </ul>
                    <p><strong>Tiempo aprox  de la cita:</strong> {selectedServicesDuration} minutos</p>
                    {/* Puedes agregar más detalles según sea necesario */}
                  </div>
                ) : (
                  <p>Completa la selección de empleado, fecha y hora.</p>
                )}
              </CCardText>


            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow className="fixed-bottom p-3 bg-dark">
        <CCol className="d-flex justify-content-start">
          <CButton
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Anterior
          </CButton>
        </CCol>
        <CCol className="d-flex justify-content-end">
          {currentPage < 3 ? (
            <CButton
              disabled={!showAgendarButton}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Siguiente
            </CButton>
          ) : (
              <CButton
                color="success"
                onClick={handleAgendarClick}
                disabled={!selectedHour}
              >
                Agendar
              </CButton>
          )}
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default AgendarCita;