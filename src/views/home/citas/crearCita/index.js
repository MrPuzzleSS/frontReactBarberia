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
import { format, isAfter, isSameDay, isBefore } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // for selectable
import CitasDataService from "src/views/services/citasService";
import 'src/scss/css/calendarStyles.css';
import 'src/scss/css/global.css';
import CitasServiciosDataService from "src/views/services/citasServiciosService";
import Swal from 'sweetalert2'
import { getUserInfo } from '../../../../components/auht';


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
  const [selectedServicesDuration, setSelectedServicesDuration] = useState(0);

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

  useEffect(() => {
    // Llama a la función para calcular el tiempo total de la cita cada vez que se actualiza el tiempo de los servicios seleccionados
    calculateAppointmentTime();
  }, [selectedServicesDuration]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setShowAgendarButton(newPage !== 3);
  };


  const handleDateSelect = (info) => {
    const date = info.start;
    const formattedDate = format(date, "yyyy-MM-dd");
  
    // Formatear la fecha de la primera entrada en agendaData
    const firstAgendaDate = agendaData.length > 0 ? format(new Date(agendaData[0].fechaInicio), "yyyy-MM-dd") : null;
  
    if (firstAgendaDate) {
      // Establecer la fecha seleccionada como la primera fecha en agendaData
      setSelectedDate(firstAgendaDate);
  
      // Llamar a calculateAppointmentTime para actualizar el tiempo total de la cita
      calculateAppointmentTime();
  
      // Convertir las fechas formateadas en objetos de fecha
      const selectedDateObj = new Date(formattedDate);
      const firstAgendaDateObj = new Date(firstAgendaDate);
  
      // Verificar si la fecha seleccionada es igual o posterior a la primera fecha en agendaData
      if (isAfter(selectedDateObj, firstAgendaDateObj) || isSameDay(selectedDateObj, firstAgendaDateObj)) {
        // Verificar si la fecha seleccionada es anterior o igual a la última fecha de finalización en agendaData
        const lastAgendaDate = format(new Date(agendaData[agendaData.length - 1].fechaFin), "yyyy-MM-dd");
        const lastAgendaDateObj = new Date(lastAgendaDate);
  
        if (isBefore(selectedDateObj, lastAgendaDateObj) || isSameDay(selectedDateObj, lastAgendaDateObj)) {
          // Si la fecha seleccionada es anterior o igual a la última fecha de finalización en agendaData
          setModalHoraVisible(true);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al Seleccionar la Fecha",
            text: "La fecha seleccionada debe ser anterior o igual a la última fecha de finalización en la lista!",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al Seleccionar la Fecha",
          text: "La fecha seleccionada debe ser igual o posterior a la primera fecha en la lista!",
        });
      }
    } else {
      // Si agendaData está vacío, manejar el caso
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No hay fechas disponibles en la lista!",
      });
    }
  };
  
  


  const createCitaServicio = async (idCita, serviciosSeleccionados) => {
    try {
      // Iterar sobre los servicios seleccionados
      for (const servicio of serviciosSeleccionados) {
        // Crear un objeto de cita de servicio
        const nuevaCitaServicio = {
          id_cita: idCita,
          id_servicio: servicio.id,
        };

        // Utilizar la función create de CitasServiciosDataService para crear la cita de servicio
        await CitasServiciosDataService.create(nuevaCitaServicio);
      }

      console.log("Citas de servicio creadas correctamente");
    } catch (error) {
      console.error("Error al crear las citas de servicio:", error);
      // Manejar el error según sea necesario
    }
  };


  const handleAgendarClick = async () => {
    const userInfo = await getUserInfo();

    if (selectedBarberoId && selectedDate && selectedHour !== null) {
      try {

        const formattedHour = selectedHour.slice(0, 5);

        // Guarda la cita al hacer clic en "Agendar"
        const nuevaCita = {
          id_empleado: selectedBarberoId,
          id_usuario: userInfo.userId, // TODO: Obtener el id del cliente
          Fecha_Atencion: selectedDate,
          Hora_Atencion: formattedHour,
        };

        // Utiliza la función create de CitasDataService para crear la cita
        const response = await CitasDataService.create(nuevaCita);

        // Utiliza la función create de CitasServiciosDataService para crear la cita_servicio
        await createCitaServicio(response.data.id_cita, selectedServices)

        if (response) {
          Swal.fire({
            icon: "success",
            title: "Se creó la cita correctamente",
            showConfirmButton: false,
          }).then(() => {
            window.location.href = "/cliente/listacitas";
          }, 1200);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al Agendar la Cita",
          text: error.message,
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al Agendar la Cita",
        text: "Completa la selección de empleado, fecha y hora antes de agendar",
      })
      // Puedes mostrar un mensaje o realizar alguna acción adicional aquí
    }
  };


  // Función para calcular la duración entre dos horas en formato HH:mm
  const getIntervalDuration = (start, end) => {
    // Verificar si start o end son null antes de intentar dividirlos
    if (start === null || end === null) {
      // Manejar el caso en el que start o end son null
      console.error("Error: La hora de inicio o fin es nula (null)");
      return null; // Otra acción adecuada según el contexto
    }

    // Divide las cadenas de inicio y fin en horas y minutos, convirtiéndolos a números
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    // Calcula el total de minutos para la hora de inicio y fin
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    // Retorna la diferencia entre los minutos totales de la hora de fin y la hora de inicio
    return endTotalMinutes - startTotalMinutes;
  };

  const handleAcceptButtonClick = () => {
    setTempSelectedServices(selectedServices);
    setVisibleLg(false);
  };

  // Función para manejar la selección de un servicio
  const handleServiceSelection = (service) => {
    const isSelected = selectedServices.some((s) => s.id === service.id);

    // Guarda tanto el nombre como la duración del servicio seleccionado
    const selectedService = {
      id: service.id,
      nombre: service.nombre,
      valor: service.valor,
      tiempo: service.tiempo,
    };

    setSelectedServices((prevSelectedServices) =>
      isSelected
        ? prevSelectedServices.filter((s) => s.id !== service.id)
        : [...prevSelectedServices, selectedService]
    );

    // Actualiza la duración total de los servicios seleccionados
    setSelectedServicesDuration((prevDuration) =>
      isSelected
        ? prevDuration - parseInt(service.tiempo) // Resta la duración del servicio
        : prevDuration + parseInt(service.tiempo) // Suma la duración del servicio
    );

    // Llama a calculateAppointmentTime después de actualizar selectedServicesDuration
    calculateAppointmentTime();

    console.log("Servicio seleccionado:", selectedService);
  };

  // Función para sumar minutos a una hora dada
  const addMinutes = (time, minutes) => {
    // Divide la cadena de tiempo en horas y minutos
    const [hours, mins] = time.split(':').map(Number);

    // Suma los minutos y calcula el exceso de horas si los minutos exceden 60
    const newMins = (mins + minutes) % 60;
    const extraHours = Math.floor((mins + minutes) / 60);

    // Suma las horas y el exceso de horas
    const newHours = (hours + extraHours) % 24;

    // Formatea la nueva hora y los minutos
    const formattedHours = String(newHours).padStart(2, '0');
    const formattedMins = String(newMins).padStart(2, '0');

    // Retorna la hora en formato HH:mm
    return `${formattedHours}:${formattedMins}`;
  };

  const calculateAppointmentTime = () => {
    // Verifica si selectedHour es nulo
    if (selectedHour === null) {
      // Maneja el caso en el que selectedHour es nulo, por ejemplo, lanzando un error o devolviendo un valor predeterminado
      console.error("Error: La hora de inicio es nula (null)");
      return null; // Otra acción adecuada según el contexto
    }

    // Obtén la hora de inicio y fin de la cita
    const horaInicio = selectedHour;
    const horaFin = addMinutes(selectedHour, +selectedServicesDuration); // Resta la duración de los servicios

    // Verifica si horaFin es nulo
    if (horaFin === null) {
      // Maneja el caso en el que horaFin es nulo, por ejemplo, lanzando un error o devolviendo un valor predeterminado
      console.error("Error: La hora de fin es nula (null)");
      return null; // Otra acción adecuada según el contexto
    }

    // Calcula la duración total de la cita
    const totalAppointmentTime = getIntervalDuration(horaInicio, horaFin);

    console.log("Total Appointment Time:", totalAppointmentTime);

    // Retorna el tiempo total de la cita
    return totalAppointmentTime;
  };

  // Función para manejar la selección de un barbero
  const handleBarberoSelection = async (id_empleado) => {

    setSelectedBarberoId(id_empleado);

    try {
      const citasAgendadas = await CitasDataService.getAllCitasAgendadas();
      const response = await CitasDataService.getEmpleadoAgendas(id_empleado);
      const agendas = response.data.agendas;
      const agendasEstadoTrue = agendas.filter(agenda => agenda.estado === true);
      setSelectedBarbero(response.data.empleado);
      setAgendaData(agendasEstadoTrue);
      setCitasAgendadasData(citasAgendadas.data.listCitas);

      // Obtener y almacenar el nombre del empleado
      const empleadoSeleccionado = empleados.find(
        (empleado) => empleado.id_empleado === id_empleado
      );
      if (empleadoSeleccionado) {
        setSelectedBarberoName(empleadoSeleccionado.nombre);
      }

      // Llamar a calculateAppointmentTime después de haber establecido todos los datos necesarios, incluida la hora seleccionada
      calculateAppointmentTime(); // Asegúrate de que selectedHour y selectedServicesDuration se hayan actualizado antes de llamar a esta función
    } catch (error) {
      console.error("Error al obtener la agenda del empleado:", error);
    }

    handlePageChange(currentPage + 1);
  };

  const generateHourOptions = (startHour, endHour, selectedDate, citasAgendadas) => {

    const options = [];
    const start = parseInt(startHour.split(":")[0]); // Extract start hour
    const end = parseInt(endHour.split(":")[0]); // Extract end hour

    for (let hour = start; hour <= end; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const suffix = hour >= 12 ? "PM" : "AM";
        const formattedHora = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`;

        // Check if the hour is occupied by a scheduled appointment
        const horaOcupada = citasAgendadas.some(cita => {
          const citaDate = new Date(cita.Fecha_Atencion);
          citaDate.setTime(citaDate.getTime() + citaDate.getTimezoneOffset() * 60 * 1000);
          const formattedCitaDate = format(citaDate, 'yyyy-MM-dd');
          return formattedCitaDate === selectedDate && cita.Hora_Atencion === formattedHora;
        });

        const hora = `${hour}:${minute.toString().padStart(2, "0")} ${suffix}`;

        const handleClick = () => {
          if (!horaOcupada) {
            setSelectedHour(formattedHora);
          }
        };

        options.push(
          <CButton
            color={horaOcupada ? "secondary" : selectedHour === formattedHora ? "success" : "info"}
            key={formattedHora}
            onClick={handleClick}
            disabled={horaOcupada}
            style={{ margin: "5px" }}
            className="col-1"
          >
            {hora}
          </CButton>
        );
      }
    }
    return <div className="row">{options}</div>;
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
                                        ? "#e83d3d"
                                        : "#4caf50",
                                      color: "#fff",
                                      padding: "8px",
                                      cursor: "pointer",
                                      borderRadius: "5px",
                                    }}
                                    onClick={() =>
                                      handleServiceSelection(service)
                                    }
                                  >
                                    {selectedServices.some((s) => s.id === service.id)
                                      ? "Deseleccionar"
                                      : "Seleccionar"}
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
                                  selectedBarberoId === empleado.id_empleado
                                    ? "2px solid #007bff"
                                    : "1px solid #000",
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
                        scrollable
                        alignment="center"
                        size="lg"
                        backdrop="static"
                        visible={modalHoraVisible}
                        onClose={() => setModalHoraVisible(false)}
                        aria-labelledby="LiveDemoExampleLabel"
                      >
                        <CModalHeader
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
                                <div>
                                  {generateHourOptions(
                                    agendaData[0].horaInicio,
                                    agendaData[0].horaFin,
                                    selectedDate,
                                    citasAgendadas
                                  )}
                                </div>
                              </div>
                            )}
                          </CModalBody>
                        </CModalBody>
                        <CModalFooter>
                          <CButton color="secondary" onClick={() => setModalHoraVisible(false)}>
                            Selecionar Hora
                          </CButton>
                        </CModalFooter>
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
                      <strong>Hora:</strong> {selectedHour !== null ? `${selectedHour > 12 ? selectedHour - 12 : selectedHour} ${selectedHour >= 12 ? 'PM' : 'AM'}` : 'Selecciona una hora'} <br />
                      <strong>Servicios:</strong>
                    </p>
                    <ul>
                      {tempSelectedServices.map((service, index) => (
                        <li key={index}>
                          {service.nombre} <br />
                          <strong style={{ display: "inline-block", width: "50px" }}>Valor:</strong> ${service.valor.toLocaleString()}
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