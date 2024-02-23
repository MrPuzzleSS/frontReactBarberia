import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Swal from 'sweetalert2';
import '@fullcalendar/daygrid';
import swal from 'sweetalert';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import agendaService from '../../services/agendaService';
import EventReport from '../../generacionPdf/EventReport';
import interactionPlugin from '@fullcalendar/interaction';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';
import esLocale from '@fullcalendar/core/locales/es';
import timeGridPlugin from '@fullcalendar/timegrid';
import 'src/scss/css/calendarStyles.css';
import io from 'socket.io-client';


const CrearConfiguracion = () => {

    const MultiSelect = ({ options, selectedValues, onChange }) => {
        const handleChange = (selectedOption) => {
            onChange(selectedOption);
        };

        console.log('Soy felix', options, selectedValues, onChange);
        const selectedOptions = options.filter((option) => selectedValues.includes(option.value));

        return (
            <Select isMulti options={options} value={selectedOptions} onChange={handleChange} />
        );
    };

    MultiSelect.propTypes = {
        options: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired,
            })
        ).isRequired,
        selectedValues: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    const calendarRef = useRef(null);
    const [formData, setFormData] = useState({
        fechaInicio: '',
        fechaFin: '',
        horaInicio: '',
        horaFin: '',
        empleadosSeleccionados: [],
        busquedaEmpleado: '',
    });

    const [events, setEvents] = useState([]);
    const [empleados, setEmpleados] = useState([]);


    const fetchEmpleados = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = 'http://localhost:8095/api/empleado';
    
        // Configurar Axios para enviar el token en el encabezado de autorización
        axios.interceptors.request.use(config => {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        }, error => {
          return Promise.reject(error);
        });
    
        const response = await axios.get(apiUrl);
        if (!response.data.empleados || !Array.isArray(response.data.empleados)) {
          throw new Error('La respuesta no contiene un array de empleados');
        }
    
        const formattedEmpleados = response.data.empleados.map((empleado) => ({
          value: empleado.id_empleado.toString(), // Asegúrate de convertir el ID a cadena
          label: `${empleado.nombre} ${empleado.apellido}`,
          // Otros datos del empleado...
        }));
        setEmpleados(formattedEmpleados);
      } catch (error) {
        console.error('Error al obtener empleados:', error);
      }
    };
    
    useEffect(() => {
        fetchEmpleados();
    }, []);

    const handleEmpleadosChange = (selectedEmpleados) => {
        const selectedValues = selectedEmpleados.map((option) => option.value);
        const selectedEmpleadosData = empleados.filter((empleado) => selectedValues.includes(empleado.value));
        selectedEmpleadosData.forEach((empleado) => {
            console.log('Empleado seleccionado:', empleado);
        });

        formData.empleadosSeleccionados = selectedValues
        setFormData((prevFormData) => ({
            ...prevFormData,
            empleadosSeleccionados: selectedValues,
        }));
        console.log('Estado actual de formData:', formData);
    };

    const socketRef = useRef(null);

    const getToken = () => {
        // Obtener el token del localStorage
        return localStorage.getItem('token');
    };

    useEffect(() => {
        const token = getToken();

        // Establecer conexión con el servidor de sockets y enviar el token como un parámetro
        socketRef.current = io('http://localhost:8095', {
            auth: { token: token }
        });

        socketRef.current.on('connect', () => {
            console.log('Conectado al servidor Socket.IO');
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('Error de conexión:', error);
        });

        // Configurar Axios para enviar el token en el encabezado de autorización
        axios.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        }, error => {
            return Promise.reject(error);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);




    const colorArray = [
        '#FF6633', '#FFB399', '#FF33FF', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
    ];

    const generateColor = (id_empleado) => {
        const color = colorArray[id_empleado - 1] || '#CCCCCC';
        return color;
    };

    const fetchAgendas = useCallback(async () => {

        try {
            console.log('Iniciando fetch de agendas...');

            const data = await agendaService.getAllAgendas();
            console.log('Estos son los datos obtenidos:', data);

            const agendas = data.agendas || [];

            if (Array.isArray(agendas)) {
                const formattedEvents = agendas.map((agenda) => ({
                    title: `Agenda ${agenda.id_empleado}`,
                    start: new Date(agenda.fechaInicio),
                    end: new Date(agenda.fechaFin),
                    horaInicio: agenda.horaInicio,
                    horaFin: agenda.horaFin,
                    empleado: agenda.id_empleado,
                    id_agenda: agenda.id_agenda,
                    estado: agenda.estado,
                    editable: true,
                    backgroundColor: generateColor(agenda.id_empleado)
                }));

                setEvents(formattedEvents);
                console.log('Eventos actualizados:', formattedEvents);

                // Emitir el mensaje después de actualizar los eventos
                socketRef.current.emit('agendaActualizada', { agendas: formattedEvents });
                console.log('Mensaje emitido: agendaActualizada');
            } else {
                console.error('Las agendas no se obtuvieron como un array:', data);
                console.log('Estructura de las agendas:', data);
            }
        } catch (error) {
            console.error('Error al obtener las agendas:', error);
        }
    }, [setEvents, socketRef]);

    useEffect(() => {
        const fetchDataAndEmit = async () => {
            await fetchAgendas();
        };

        fetchDataAndEmit();
    }, [fetchAgendas]);


    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (formData.empleadosSeleccionados.length === 0) {
            swal({
                title: 'Error',
                text: 'El campo de empleado es requerido. Por favor, seleccione al menos un empleado.',
                icon: 'error',
                button: 'Aceptar',
            });
        }

        try {
            const fechaInicio = new Date(`${formData.fechaInicio}T${formData.horaInicio}`);
            const fechaFin = new Date(`${formData.fechaFin}T${formData.horaFin}`);
            const dias = Math.floor((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
            if (dias >= 0) {
                let currentDate = new Date(fechaInicio);

                while (currentDate <= fechaFin) {
                    const existingAgenda = events.find(
                        (event) =>
                            event.start.getTime() === currentDate.getTime() ||
                            (event.end && event.end.getTime() === currentDate.getTime())
                    );

                    if (!existingAgenda) {
                        const newEndDate = new Date(currentDate);
                        newEndDate.setHours(fechaFin.getHours(), fechaFin.getMinutes());

                        const empleadoSeleccionado = empleados.filter((empleado) =>
                            formData.empleadosSeleccionados.includes(empleado.value)
                        );

                        console.log('empleadoSeleccionado', empleadoSeleccionado);

                        if (empleadoSeleccionado) {
                            empleadoSeleccionado.forEach(async (barbero) => {
                                const newEvent = {
                                    id_empleado: parseInt(barbero.value),
                                    fechaInicio: new Date(currentDate),
                                    fechaFin: newEndDate,
                                    horaInicio: formData.horaInicio,
                                    horaFin: formData.horaFin,
                                    nombreEmpleado: barbero.label // Agregar la propiedad nombreEmpleado aquí
                                };

                                console.log('newEvent', newEvent);

                                try {
                                    // Crear el evento con el empleado seleccionado
                                    await agendaService.createAgenda(newEvent);

                                    // Agregar el nuevo evento a la lista de eventos utilizando el callback de setEvents
                                    setEvents((prevEvents) => [...prevEvents, newEvent]);

                                    // Emitir el mensaje de nueva agenda creada
                                    socketRef.current.emit('nuevaAgendaCreada', newEvent);
                                    console.log('Mensaje emitido: nuevaAgendaCreada');
                                } catch (error) {
                                    console.error('Error al crear la agenda:', error);
                                }
                            });

                        } else {
                            console.log('No se encontraron barberos seleccionados.');
                        }
                    }

                    currentDate.setDate(currentDate.getDate() + 1);
                }

                swal({
                    title: 'Éxito',
                    text: 'La agenda  ha sido programada con éxito',
                    icon: 'success',
                    button: 'Aceptar',
                });

                updateCalendar();
            } else {
                swal({
                    title: 'Error',
                    text: 'La fecha de inicio debe ser anterior o igual a la fecha de fin',
                    icon: 'error',
                    button: 'Aceptar',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            swal({
                title: 'Error',
                text: 'Hubo un error al programar la configuración',
                icon: 'error',
                button: 'Aceptar',
            });
        }
    };

    const updateCalendar = () => {
        if (calendarRef.current) {
            calendarRef.current.getApi().refetchEvents();
        }
    };

    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEditEvent = (clickInfo) => {
        const eventId = clickInfo?.event?.extendedProps?.id_agenda;

        if (eventId) {
            console.log('ID del evento:', eventId);

            agendaService.getAgendaById(eventId)
                .then((eventoEdit) => {
                    console.log('Detalles del evento obtenidos:', eventoEdit);
                    setEventoSeleccionado(eventoEdit);

                    if (eventoEdit && eventoEdit.empleadosSeleccionados) {
                        const empleadosSeleccionados = eventoEdit.empleadosSeleccionados.map((id_empleado) =>
                            empleados.find((empleado) => empleado.value === id_empleado)
                        );

                        setEventoSeleccionado((prevEventoSeleccionado) => ({
                            ...prevEventoSeleccionado,
                            empleadosSeleccionados,
                        }));
                    }


                    setShowEditModal(true);
                })
                .catch((error) => {
                    console.error('Error al obtener detalles de la agenda:', error);
                });

        } else {
            console.error('ID de agenda inválido');
        }
    };

    const handleGuardarCambios = () => {
        console.log('Evento a actualizar:', eventoSeleccionado);
        if (eventoSeleccionado) {
            const eventId = eventoSeleccionado.id_agenda;
            agendaService.updateAgenda(eventId, eventoSeleccionado)
                .then((response) => {
                    console.log('Respuesta de actualización:', response);
                    // Realiza cualquier otra operación después de la actualización exitosa

                    // Cierra el modal y reinicia el estado del evento seleccionado
                    setShowEditModal(false);
                    setEventoSeleccionado(null);

                    // Actualiza el calendario después de la edición

                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'El evento ha sido actualizado correctamente.',

                    });
                    updateCalendar();
                })

                .catch((error) => {
                    console.error('Error al actualizar la agenda:', error);
                    // Manejo de errores
                });
        } else {
            console.error('No hay evento seleccionado para actualizar');
            // Manejo si no hay ningún evento seleccionado para actualizar
        }
    };

    //---------------------------------------------------------------------------
    const [showCreateModal, setShowCreateModal] = useState(false);
    const handleDateClick = (info) => {
        const clickedDate = info.date;
        setShowCreateModal(true);
        setFormData({
            ...formData,
            fechaInicio: clickedDate.toISOString().split('T')[0],
            fechaFin: clickedDate.toISOString().split('T')[0],
            horaInicio: '09:00',
            horaFin: '21:00',
            empleadosSeleccionados: [],
        });
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        // Limpiar los valores del formulario si es necesario
        setFormData({
            fechaInicio: '',
            fechaFin: '',
            horaInicio: '',
            horaFin: '',
            empleadosSeleccionados: [],
            busquedaEmpleado: '',
        });
    };

    const handleCrearAgenda = async () => {
        try {
            // Obtener datos del formulario
            const { horaInicio, horaFin, empleadosSeleccionados, fechaInicio, fechaFin } = formData;
            const currentDate = new Date();
            const fechaHoy = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Fecha actual sin hora
            const fechaInicioEvento = new Date(`${fechaInicio}T${horaInicio}`);
            const fechaFinEvento = new Date(`${fechaFin}T${horaFin}`);

            // Verificar datos de empleadosSeleccionados
            console.log("empleadosSeleccionados:", empleadosSeleccionados);

            // Validación de fechas anteriores al día actual
            if (fechaInicioEvento < fechaHoy || fechaFinEvento < fechaHoy) {
                throw new Error('No puedes crear eventos en fechas anteriores al día actual');
            }

            // Validación de campos obligatorios
            if (!fechaInicioEvento || !fechaFinEvento || !horaInicio || !horaFin || !empleadosSeleccionados || empleadosSeleccionados.length === 0) {
                throw new Error('Todos los campos son obligatorios');
            }

            // Validación de horas de inicio y fin
            if (horaInicio > horaFin) {
                throw new Error('La hora de inicio no puede ser posterior a la hora de fin');
            }

            // Validación de fechas de inicio y fin
            if (fechaInicioEvento > fechaFinEvento) {
                throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin');
            }

            // Resto del código para la creación de eventos...
            const newEvents = [];
            let currentDateEvent = new Date(fechaInicioEvento);

            while (currentDateEvent <= fechaFinEvento) {
                const newEndDate = new Date(currentDateEvent);
                newEndDate.setHours(fechaFinEvento.getHours(), fechaFinEvento.getMinutes());

                for (const empleado of empleadosSeleccionados) {
                    const nombre = empleado.nombre ?? 'Nombre desconocido';
                    const apellido = empleado.apellido ?? 'Apellido desconocido';
                    const newEvent = {
                        fechaInicio: currentDateEvent,
                        fechaFin: newEndDate,
                        horaInicio,
                        horaFin,
                        title: `Agenda de ${nombre} ${apellido}`,
                        id_empleado: empleado,
                        nombreEmpleado: `${nombre} ${apellido}` // Agregar la propiedad nombreEmpleado aquí
                    };

                    console.log("Nuevo evento:", newEvent); // Verificar el nuevo evento antes de crearlo
                    const createdEvent = await agendaService.createAgenda(newEvent);
                    newEvents.push(createdEvent);
                }

                currentDateEvent.setDate(currentDateEvent.getDate() + 1);
            }
            // Actualización de eventos y estado
            setEvents((prevEvents) => [...prevEvents, ...newEvents]);
            await fetchAgendas();
            setShowCreateModal(false);

            // Limpiar el formulario
            setFormData({
                fechaInicio: '',
                fechaFin: '',
                horaInicio: '',
                horaFin: '',
                empleadosSeleccionados: [],
                busquedaEmpleado: '',
            });

            // Mostrar mensaje de éxito y actualizar calendario
            Swal.fire({
                title: 'Éxito',
                text: 'La agenda ha sido creada con éxito',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });
            updateCalendar();
        } catch (error) {
            // Manejo de errores
            console.error('Error al crear la agenda:', error);

            let errorMessage = 'Error el empleado ya se encuentra con un horario asignado para este dia: Error';

            if (error.response && error.response.data && error.response.data.sqlMessage) {
                errorMessage = error.response.data.sqlMessage;
            }

            // Mostrar mensaje de error al usuario
            Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    };


    const [searchText, setSearchText] = useState('');
    const filteredEvents = events.filter((event) => {
        const nombreEmpleado = (event.title || '').toString().toLowerCase(); // Asegúrate de que event.title esté definido antes de llamar a toString
        console.log('Nombre del empleado:', nombreEmpleado); // Console.log para ver el nombre del empleado

        return (
            nombreEmpleado.includes(searchText.toLowerCase()) // Filtrar por nombre del empleado
        );
    });




    const handleEventDrop = async (eventDropInfo) => {
        try {
            const { id, start, end } = eventDropInfo.event;
            const empleadoId = eventDropInfo.event.extendedProps.id_empleado;

            // Validar si la fecha está fuera del día actual
            const currentDate = new Date();
            const fechaHoy = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

            if (start < fechaHoy || end < fechaHoy) {
                throw new Error('No puedes arrastrar eventos a fechas anteriores al día actual');
            }

            // Verificar si la agenda está deshabilitada antes de permitir la edición
            if (!eventDropInfo.event.extendedProps.estado) {
                throw new Error('No puedes editar una agenda deshabilitada');
            }

            // Verificar si el evento se está moviendo a una nueva posición ocupada
            if (eventDropInfo.oldEvent && eventDropInfo.oldEvent.id) {
                // Filtrar eventos del mismo empleado, excluyendo el evento actual
                const eventosEmpleado = events.filter((evento) => {
                    return evento.extendedProps.id_empleado === empleadoId && evento.id !== id;
                });

                const nuevoEvento = {
                    start,
                    end,
                };

                const hayCoincidencia = eventosEmpleado.some((evento) => {
                    const horarioEvento = {
                        start: evento.start,
                        end: evento.end,
                    };

                    // Verificar si hay superposición de horarios
                    return (
                        nuevoEvento.start < horarioEvento.end &&
                        nuevoEvento.end > horarioEvento.start
                    );
                });

                if (hayCoincidencia) {
                    throw new Error('No puedes arrastrar eventos donde el empleado tiene el mismo horario');
                }
            }

            // Actualizar la base de datos con los nuevos detalles del evento
            await agendaService.updateAgenda(eventDropInfo.event.extendedProps.id_agenda, {
                fechaInicio: start,
                fechaFin: end
            });

            // Actualizar el estado local solo si la actualización en la base de datos es exitosa
            const updatedEvents = events.map((event) => {
                if (event.id === id) {
                    return {
                        ...event,
                        start,
                        end,
                    };
                }
                return event;
            });

            setEvents(updatedEvents);

            // Mostrar mensaje de éxito con SweetAlert
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'El evento ha sido actualizado correctamente.',
            });

        } catch (error) {
            console.error('Error al actualizar el evento:', error);
            // Mostrar mensaje de error con SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    };



    const motivosPredefinidos = [
        'Enfermedad',
        'Incapacidad',
        'Emergencia familiar',
    ];

    return (
        <div className="container mt-6">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <CCard className="w-100">
                        <CCard className="w-100">
                            <CCard className="w-100 custom-card">
                                <CCardHeader className="text-center">
                                    <h2 className="my-custom-header">PROGRAMAR AGENDA</h2>
                                </CCardHeader>
                            </CCard>
                        </CCard>
                        <CCardBody>
                            <div className="row mb-2">
                                <div className="col-md-6">
                                    <div className="form-group mb-0">
                                        <div className="input-group custom-input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Buscar evento..."
                                                value={searchText}
                                                onChange={(e) => setSearchText(e.target.value)}
                                            />

                                            <div className="input-group-append">
                                                <button type="button" className="btn btn-buscar">
                                                    <i className="bi bi-search"></i> Buscar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <EventReport events={events} className="ml-auto" />
                                </div>
                            </div>
                            <FullCalendar
                                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                                dateClick={handleDateClick}
                                eventDrop={handleEventDrop}
                                initialView="dayGridMonth"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                                }}
                                locale={esLocale}
                                events={filteredEvents.length > 0 ? filteredEvents : events}
                                eventContent={(arg) => {
                                    console.log('Evento:', arg.event); // Agregamos este console.log para verificar el evento
                                    // Obtener el empleado asociado al evento
                                    const empleadoSeleccionado = empleados.find(
                                        (empleado) => empleado.value === arg.event.extendedProps.empleado
                                    );

                                    // Verificar si la agenda está deshabilitada
                                    const isDisabled = !arg.event.extendedProps.estado;

                                    // Obtener el nombre del empleado o mostrar "Desactivado" si la agenda está deshabilitada
                                    const nombreEmpleado = isDisabled ? `Desactivado (${arg.event.extendedProps.nombreEmpleado})` : (empleadoSeleccionado ? empleadoSeleccionado.label : 'Desconocido');
                                    console.log("este es esl", empleadoSeleccionado);

                                    // Establecer el color del evento
                                    const backgroundColor = isDisabled ? '#666666' : arg.event.backgroundColor;

                                    return (
                                        <span style={{ backgroundColor, color: 'white', padding: '2px 5px', borderRadius: '3px' }}>
                                            {isDisabled ? (
                                                <span className={`rotar-circular animacion-rotar-circular`}>🚫</span>
                                            ) : null}
                                            {isDisabled ? (
                                                <span><span style={{ color: '#FFFF11' }}>(Inac)</span> {empleadoSeleccionado ? empleadoSeleccionado.label : 'Desconocido'}</span>
                                            ) : (
                                                <span>{empleadoSeleccionado ? empleadoSeleccionado.label : 'Desconocido'}</span>
                                            )}
                                        </span>
                                    );

                                }}

                                eventClick={(clickInfo) => {
                                    // Obtener el empleado asociado al evento
                                    const empleadoSeleccionado = empleados.find(
                                        (empleado) => empleado.value === clickInfo.event.extendedProps.empleado
                                    );

                                    // Verificar si el empleado seleccionado está definido y tiene una etiqueta
                                    const nombreEmpleado = empleadoSeleccionado ? empleadoSeleccionado.label : 'Desconocido';

                                    Swal.fire({
                                        title: clickInfo.event.title,
                                        html: `
                <div style="font-weight: bold;">
                    Detalles del evento<br/>
                    Fecha de inicio: ${clickInfo.event.start.toLocaleDateString()}<br/>
                    Fecha de fin: ${clickInfo.event.end ? clickInfo.event.end.toLocaleDateString() : 'No end date'}<br/>
                    Hora de inicio: ${clickInfo.event.extendedProps.horaInicio}<br/>
                    Hora de fin: ${clickInfo.event.extendedProps.horaFin}<br/>
                    Empleado: ${nombreEmpleado}
                </div>
            `,
                                        showCancelButton: true,
                                        showConfirmButton: true,
                                        showDenyButton: true,
                                        confirmButtonText: 'Editar',
                                        denyButtonText: !clickInfo.event.extendedProps.estado ? 'Habilitar Agenda' : 'Cancelar Agenda',
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            // Validar si la agenda está deshabilitada antes de editar
                                            if (!clickInfo.event.extendedProps.estado) {
                                                Swal.fire('Error', 'No puedes editar una agenda deshabilitada', 'error');
                                            } else {
                                                handleEditEvent(clickInfo);
                                                setShowEditModal(true);
                                            }
                                        } else if (result.isDenied) {
                                            const disableEvent = !clickInfo.event.extendedProps.estado;
                                            if (disableEvent) { // Solo si se está deshabilitando
                                                Swal.fire({
                                                    title: '¿Estás seguro de habilitar esta agenda?',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Sí',
                                                    cancelButtonText: 'Cancelar',
                                                }).then((confirmResult) => {
                                                    if (confirmResult.isConfirmed) {
                                                        // Resto del código para habilitar el evento sin preguntar motivo
                                                        agendaService
                                                            .disableEvent(clickInfo?.event?._def?.extendedProps?.id_agenda, '', clickInfo.event.extendedProps.estado)
                                                            .then(() => {
                                                                // Actualizar eventos y mostrar mensaje de éxito
                                                                fetchAgendas();
                                                                const updatedEvents = events.map((event) => {
                                                                    if (event.id === clickInfo.event.id) {
                                                                        return {
                                                                            ...event,
                                                                            extendedProps: {
                                                                                ...event.extendedProps,
                                                                                estado: !disableEvent,
                                                                            },
                                                                        };
                                                                    }
                                                                    return event;
                                                                });
                                                                setEvents(updatedEvents);

                                                                const successMessage = disableEvent ? 'Evento habilitado' : 'Evento inhabilitado';
                                                                Swal.fire('¡Éxito!', `${successMessage}`, 'success');
                                                            })
                                                            .catch((error) => {
                                                                console.error('Error al realizar la acción:', error);
                                                            });
                                                    }
                                                });
                                            } else {
                                                Swal.fire({
                                                    title: `Motivo de inhabilitación`,
                                                    html: `
                            <div>
                                <label for="motivoSelect">Motivo:</label>
                                <select id="motivoSelect">
                                    <option value="">Seleccionar motivo...</option>
                                    ${motivosPredefinidos.map((motivo) => `<option value="${motivo}">${motivo}</option>`).join('')}
                                    <option value="Otro">Otro</option> <!-- Nuevo campo 'Otro' -->
                                </select>
                                <br/>
                                <label for="otroMotivo" id="otroMotivoLabel" style="display:none;">Otro motivo:</label>
                                <input type="text" id="otroMotivo" style="display:none;">
                            </div>
                        `,
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Inhabilitar',
                                                    preConfirm: () => {
                                                        const motivoSeleccionado = document.getElementById('motivoSelect').value;
                                                        const otroMotivo = document.getElementById('otroMotivo').value;
                                                        return motivoSeleccionado === 'Otro' ? otroMotivo : motivoSeleccionado;
                                                    },
                                                    didOpen: () => {
                                                        // Mostrar campo 'Otro' al seleccionar 'Otro' en la lista desplegable
                                                        const motivoSelect = document.getElementById('motivoSelect');
                                                        const otroMotivoLabel = document.getElementById('otroMotivoLabel');
                                                        const otroMotivoInput = document.getElementById('otroMotivo');

                                                        motivoSelect.addEventListener('change', () => {
                                                            if (motivoSelect.value === 'Otro') {
                                                                otroMotivoLabel.style.display = 'block';
                                                                otroMotivoInput.style.display = 'block';
                                                            } else {
                                                                otroMotivoLabel.style.display = 'none';
                                                                otroMotivoInput.style.display = 'none';
                                                            }
                                                        });
                                                    },
                                                }).then((motivoResult) => {
                                                    if (motivoResult.isConfirmed) {
                                                        const motivoFinal = motivoResult.value;
                                                        if (motivoFinal && motivoFinal.trim() !== '') {
                                                            // Resto del código para inhabilitar el evento con el motivo proporcionado
                                                            agendaService
                                                                .disableEvent(clickInfo?.event?._def?.extendedProps?.id_agenda, motivoFinal, clickInfo.event.extendedProps.estado)
                                                                .then(() => {
                                                                    // Actualizar eventos y mostrar mensaje de éxito
                                                                    fetchAgendas();
                                                                    const updatedEvents = events.map((event) => {
                                                                        if (event.id === clickInfo.event.id) {
                                                                            return {
                                                                                ...event,
                                                                                extendedProps: {
                                                                                    ...event.extendedProps,
                                                                                    estado: !disableEvent,
                                                                                },
                                                                            };
                                                                        }
                                                                        return event;
                                                                    });
                                                                    setEvents(updatedEvents);

                                                                    const successMessage = disableEvent ? 'Evento habilitado' : 'Evento inhabilitado';
                                                                    Swal.fire('¡Éxito!', `${successMessage} con motivo: ${motivoFinal}`, 'success');
                                                                })
                                                                .catch((error) => {
                                                                    console.error('Error al realizar la acción:', error);
                                                                });
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }}
                            />


                        </CCardBody>
                    </CCard>
                    <Modal
                        show={showEditModal}
                        onHide={() => {
                            setShowEditModal(false);
                            setEventoSeleccionado(null);
                        }}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Editar Evento</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleFormSubmit}>
                                <div className="form-group">
                                    <label>Hora inicio</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={eventoSeleccionado?.horaInicio || ''}
                                        onChange={(e) => setEventoSeleccionado({
                                            ...eventoSeleccionado,
                                            horaInicio: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Hora fin</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={eventoSeleccionado?.horaFin || ''}
                                        onChange={(e) => setEventoSeleccionado({
                                            ...eventoSeleccionado,
                                            horaFin: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Barbero</label>
                                    <MultiSelect
                                        options={empleados}
                                        selectedValues={[eventoSeleccionado?.id_empleado || []]}
                                        onChange={(selected) => {
                                            setEventoSeleccionado({
                                                ...eventoSeleccionado,
                                                id_empleado: selected[0]?.value
                                            });
                                        }}
                                    />
                                </div>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEventoSeleccionado(null);
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={handleGuardarCambios}>
                                Guardar Cambios
                            </Button>

                        </Modal.Footer>
                    </Modal>
                    <Modal show={showCreateModal} onHide={null}>
                        <Modal.Header closeButton>
                            <Modal.Title>Crear Agenda</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="form-group">
                                <label>Fecha Inicio</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.fechaInicio}
                                    onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Fecha Fin</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.fechaFin}
                                    onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Hora Inicio</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={formData.horaInicio}
                                    onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Hora Fin</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={formData.horaFin}
                                    onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Barberos</label>
                                <MultiSelect
                                    options={empleados}
                                    selectedValues={formData.empleadosSeleccionados}
                                    onChange={handleEmpleadosChange}
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseCreateModal}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={handleCrearAgenda}>
                                Crear Agenda
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default CrearConfiguracion;