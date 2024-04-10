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
import 'src/scss/css/calendarStyles.css';
import 'src/scss/css/global.css';
import CitasServiciosDataService from "src/views/services/citasServiciosService";
import Swal from 'sweetalert2'
import { getUserInfo } from '../../../../components/auht';
import crearConfiguracion from 'src/views/agendas/crearConfiguracion/programacion';


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
  const [selectedHourFin, setSelectedHourFin] = useState(null);


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
    const today = new Date(); // Obtener la fecha de hoy

    // Formatear las fechas
    const formattedDate = format(date, "yyyy-MM-dd");
    const formattedToday = format(today, "yyyy-MM-dd");

    console.log("Fecha seleccionada:", formattedDate);
    console.log("Fecha de hoy:", formattedToday);

    // Dentro de la función handleDateSelect, después de establecer la fecha y antes de mostrar el modal de hora
    setSelectedDate(formattedDate);

    // Asegúrate de que esta línea esté presente
    setModalHoraVisible(true);

    // Calcula la hora de fin basada en la hora de inicio y la duración de los servicios seleccionados
    const horaFin = addMinutes(selectedHour, selectedServicesDuration);

    // Nuevo console.log para verificar la hora de inicio y la hora de fin después de seleccionar la fecha
    console.log("Hora de inicio:", selectedHour);
    console.log("Hora de fin calculada:", horaFin);

    // Guarda la hora de fin en el estado
    setSelectedHourFin(horaFin); // Asegúrate de que setSelectedHourFin esté definido y disponible en el alcance de este componente

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







  const createCitaServicio = async (idCita, serviciosSeleccionados) => {
    try {
      // Iterar sobre los servicios seleccionados
      for (const servicio of serviciosSeleccionados) {
        // Crear un objeto de cita de servicio
        const nuevaCitaServicio = {
          id_cita: idCita,
          id_servicio: servicio.id,
        };

        console.log(nuevaCitaServicio);

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
          Hora_Fin: selectedHourFin, // Use selectedHourFin instead of horaFin

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
    // Verifica si time es null
    if (time === null) {
      console.error("Error: La hora es nula (null)");
      return null; // Otra acción adecuada según el contexto
    }

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
    const result = `${formattedHours}:${formattedMins}`;
    console.log("Hora de fin calculada en addMinutes:", result);
    return result;
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


  const handleBarberoSelection = async (id_empleado) => {
    setSelectedBarberoId(id_empleado);

    try {
      const citasAgendadas = await CitasDataService.getAllCitasAgendadas();
      console.log("Citas Agendadas:", citasAgendadas); // Mostrar citas agendadas en la consola

      const response = await CitasDataService.getEmpleadoAgendas(id_empleado);
      const agendas = response.data.agendas;
      const agendasEstadoTrue = agendas.filter(agenda => agenda.estado === true);
      setSelectedBarbero(response.data.empleado);
      setAgendaData(agendasEstadoTrue);
      setCitasAgendadasData(citasAgendadas.data.listCitas);
      


      // Llamar a calculateAppointmentTime después de haber establecido todos los datos necesarios, incluida la hora seleccionada
      calculateAppointmentTime();

      // Obtener y almacenar el nombre del empleado
      const empleadoSeleccionado = empleados.find(
        (empleado) => empleado.id_empleado === id_empleado
      );
      if (empleadoSeleccionado) {
        setSelectedBarberoName(empleadoSeleccionado.nombre);
      }


      // Nuevo console.log para verificar la hora de fin después de calcularla
      console.log("Hora de inicio:", selectedHour);
      console.log("Hora de fin calculada:", selectedHourFin);

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

        // Dentro de tu función generateHourOptions
        const handleClick = () => {
          if (!horaOcupada) {
            setSelectedHour(formattedHora);
            // Calcular la hora de fin basada en la hora seleccionada y la duración de los servicios
            const horaFin = addMinutes(formattedHora, selectedServicesDuration);
            setSelectedHourFin(horaFin);
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

 


  // Function to calculate the total value of selected services
  const calculateTotalValue = () => {
    return tempSelectedServices.reduce((total, service) => total + service.valor, 0);
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
                            Cancelar
                          </CButton>
                          <CButton
                            color="primary"
                            onClick={() => {
                              // Verifica si se ha seleccionado una hora
                              if (selectedHour !== null) {
                                // Calcula la hora de fin basada en la hora seleccionada y la duración de los servicios
                                const horaFin = addMinutes(selectedHour, selectedServicesDuration);
                                setSelectedHourFin(horaFin);
                                // Cierra el modal
                                setModalHoraVisible(false);
                              } else {
                                // Muestra un mensaje de error si no se ha seleccionado una hora
                                Swal.fire({
                                  icon: "error",
                                  title: "Error al Seleccionar la Hora",
                                  text: "Selecciona una hora antes de continuar",
                                });
                              }
                            }}
                          >
                            Seleccionar Hora
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
            <CCardText>
              {selectedBarberoId && selectedDate && selectedHour ? (
                <div>
                  <p> <CCardTitle className="text-center">
                    <strong>Información de tus Servicios</strong>
                  </CCardTitle>

                    <strong>Empleado:</strong> {selectedBarberoName} <br />
                    <strong>Fecha:</strong> {selectedDate} <br />
                    <strong>Hora inicio:</strong> {selectedHour !== null ? `${selectedHour > 12 ? selectedHour - 12 : selectedHour} ${selectedHour >= 12 ? 'PM' : 'AM'}` : 'Selecciona una hora'} <br />
                    <strong>Hora Fin:</strong> {selectedHour !== null ? addMinutes(selectedHour, selectedServicesDuration) : 'Selecciona una hora'} <br />
                    <p><strong>Total:</strong> ${calculateTotalValue().toLocaleString()}</p>
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

                  {/* Calculate and display the total value of selected services */}


                  {/* Puedes agregar más detalles según sea necesario */}
                </div>
              ) : (
                <p>Completa la selección de empleado, fecha y hora.</p>
              )}
            </CCardText>


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