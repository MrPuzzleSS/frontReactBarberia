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
import socket from '../../socket';
import 'src/scss/css/calendarStyles.css';




const CrearConfiguracion = () => {


    socket.on('eventoActualizado', (eventoActualizado) => {
        console.log('Evento actualizado recibido:', eventoActualizado);
        // Aquí puedes actualizar los datos relevantes en el cliente con el evento actualizado
        // Por ejemplo, puedes actualizar el estado de los eventos o recargar la página
    });





    const MultiSelect = ({ options, selectedValues, onChange }) => {
        const handleChange = (selectedOption) => {
            onChange(selectedOption);
        };

        //  console.log('Soy felix', options, selectedValues, onChange);
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


    const getToken = () => {
        // Obtener el token del localStorage
        return localStorage.getItem('token');
    };




    const fetchEmpleados = async () => {

        try {

            //  console.log('Iniciando fetch de empleados...');


            const apiUrl = 'http://localhost:8095/api/empleado/activos';
            const response = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${getToken()}` // Añadir el token al encabezado Authorization
                }
            });

            const data = response.data;

            if (Array.isArray(data.empleados)) {
                const formattedEmpleados = data.empleados.map((empleado) => {
                    // Agregar console.log para enviar el nombre y apellido del empleado
                    //   console.log(`Nombre y Apellido del Empleado: ${empleado.nombre} ${empleado.apellido}`);

                    return {
                        value: empleado.id_empleado.toString(), // Asegúrate de convertir el ID a cadena
                        label: `${empleado.nombre} ${empleado.apellido}`,
                        // Otros datos del empleado...
                    };
                });

                setEmpleados(formattedEmpleados);
                //console.log('Empleados actualizados:', formattedEmpleados);

                // Opcional: guardar los datos en localStorage
                localStorage.setItem('empleados', JSON.stringify(formattedEmpleados));
                // console.log('Datos de empleados guardados en el almacenamiento local.');
            } else {
                console.error('La propiedad empleados no contiene un array:', data);
            }
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
            console.log('Empleado seleccionadsso:', empleado);
        });

        formData.empleadosSeleccionados = selectedValues
        setFormData((prevFormData) => ({
            ...prevFormData,
            empleadosSeleccionados: selectedValues,
        }));
        console.log('Estado actual de formData:', formData);
    };





    const colorArray = [


        '#7B68EE', '#4169E1', '#00008B',
        '#191970', '#008080', '#48D1CC', '#00CED1',
        '#5F9EA0', '#20B2AA',
        '#4682B4', '#48D1CC', '#6495ED', '#66CDAA', '#66CDAA',
        '#7FFFD4', '#7B68EE', '#87CEEB', '#87CEFA', '#8A2BE2', '#8A2BE2',
        '#8B008B', '#9370DB', '#9400D3', '#9932CC', '#BA55D3', '#DDA0DD',
        '#DB7093', '#DA70D6', '#D8BFD8', '#2E8B57', '#3CB371', '#20B2AA',
        '#7FFFD4', '#8FBC8F', '#98FB98', '#48D1CC', '#20B2AA', '#5F9EA0',
        '#6495ED', '#66CDAA', '#76EEC6', '#87CEEB', '#AFEEEE', '#E0FFFF',
        '#F0FFFF', '#7FFFD4', '#00CED1', '#00FA9A',
        '#48D1CC', '#66CDAA', '#76EEC6', '#87CEFA'
    ];





    const generateColor = (id_empleado) => {
        const color = colorArray[id_empleado - 1] || '#CCCCCC';
        return color;
    };

    const fetchAgendas = useCallback(async () => {
        try {
            //  console.log('Iniciando fetch de agendas...');
            const data = await agendaService.getAllAgendas();
            //   console.log('Estos son los datos obtenidos:', data);

            const agendas = data.agendas || [];

            if (Array.isArray(agendas)) {
                const formattedEvents = await Promise.all(agendas.map(async (agenda) => {
                    try {
                        const empleadoResponse = await axios.get(`http://localhost:8095/api/empleado/${agenda.id_empleado}`, {
                            headers: {
                                'Authorization': `Bearer ${getToken()}`
                            }
                        });
                        const empleado = empleadoResponse.data;

                        return {
                            title: `Agenda ${empleado.nombre} ${empleado.apellido}`,
                            start: new Date(agenda.fechaInicio),
                            end: new Date(agenda.fechaFin),
                            horaInicio: agenda.horaInicio,
                            horaFin: agenda.horaFin,
                            empleado: agenda.id_empleado,
                            id_agenda: agenda.id_agenda,
                            estado: agenda.estado,
                            editable: true,
                            backgroundColor: generateColor(agenda.id_empleado)
                        };
                    } catch (error) {
                        console.error('Error al obtener el empleado:', error);
                        return {
                            title: 'Agenda - Empleado Desconocido',
                            start: new Date(agenda.fechaInicio),
                            end: new Date(agenda.fechaFin),
                            horaInicio: agenda.horaInicio,
                            horaFin: agenda.horaFin,
                            empleado: agenda.id_empleado,
                            id_agenda: agenda.id_agenda,
                            estado: agenda.estado,
                            editable: true,
                            backgroundColor: generateColor(agenda.id_empleado)
                        };
                    }
                }));

                setEvents(formattedEvents);
                //Iniciando console.log('Eventos actualizados:', formattedEvents);
            } else {
                console.error('Las agendas no se obtuvieron como un array:', data);
                //     console.log('Estructura de las agendas:', data);
            }
        } catch (error) {
            console.error('Error al obtener las agendas:', error);
        }
    }, [setEvents]);


    useEffect(() => {
        const fetchData = async () => {
            await fetchAgendas();
        };

        fetchData();
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

                        console.log('empledo llllll', empleadoSeleccionado);

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

                                try {
                                    // Crear el evento con el empleado seleccionado
                                    const response = await agendaService.createAgenda(newEvent);

                                    // Emitir un evento al servidor para notificar sobre la nueva agenda creada
                                    socket.emit('nuevaAgendaCreada', response.data);

                                    // Escuchar el evento de actualización desde el servidor
                                    socket.on('eventoActualizado', (eventoActualizado) => {
                                        console.log('Evento actualizado recibido:', eventoActualizado);
                                        // Actualizar los datos relevantes en el cliente con el evento actualizado
                                        setEvents((prevEvents) => [...prevEvents, eventoActualizado]);
                                        updateCalendar();
                                    });

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
                    text: 'La agenda ha sido programada con éxito',
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


    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [eventos, setEventos] = useState([]);


    const handleEditEvent = async (clickInfo) => {
        const eventId = clickInfo?.event?.extendedProps?.id_agenda;

        if (eventId) {
            try {
                // Obtener los detalles del evento
                const eventoEdit = await agendaService.getAgendaById(eventId);
                console.log('Detalles del evento obtenidos:', eventoEdit);

                // Actualizar el estado con los nuevos detalles del evento
                setEventoSeleccionado(eventoEdit); // Aquí se actualiza el estado
                setShowEditModal(true);
            } catch (error) {
                console.error('Error al obtener detalles de la agenda:', error);
            }
        } else {
            console.error('ID de agenda inválido');
        }
    };

    const updateCalendar = () => {
        if (calendarRef.current) {
            calendarRef.current.getApi().refetchEvents();
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
                    updateCalendar();

                    // Envía un mensaje al servidor de sockets indicando que el evento ha sido actualizado
                    socket.emit('eventoActualizado', eventId);

                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'El evento ha sido actualizado correctamente.',
                    });

                    // Recarga la página después de 1 segundo (1000 milisegundos)
                    setTimeout(() => {
                        window.location.reload();
                    }, 10);
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



    // Escuchar el evento 'eventoActualizado' desde el servidor
    socket.on('eventoActualizado', (eventoActualizado) => {
        console.log('Evento actualizado recibido:', eventoActualizado);
        // Actualizar los datos relevantes en el cliente con el evento actualizado
        // Aquí puedes implementar la lógica para actualizar los datos en tu aplicación
        // Por ejemplo, puedes actualizar el estado de los eventos o recargar la página

        // Ejemplo: Actualizar el estado de los eventos en el cliente
        const eventosActualizados = eventos.map(evento => {
            if (evento.id_agenda === eventoActualizado.id_agenda) {
                // Actualizar el evento con los datos recibidos del servidor
                return eventoActualizado;
            } else {
                return evento;
            }
        });

        // Actualizar el estado de los eventos en el cliente
        setEventos(eventosActualizados);
    });



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
        let errorMessage; // Declaración de la variable errorMessage
    
        try {
            // Obtener datos del formulario
            const { horaInicio, horaFin, empleadosSeleccionados, fechaInicio, fechaFin } = formData;
            const currentDate = new Date();
            const fechaHoy = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Fecha actual sin hora
            const fechaInicioEvento = new Date(`${fechaInicio}T${horaInicio}`);
            const fechaFinEvento = new Date(`${fechaFin}T${horaFin}`);
    
            // Validación de fechas anteriores al día actual
            if (fechaInicioEvento < fechaHoy || fechaFinEvento < fechaHoy) {
                throw new Error('No puedes crear eventos en fechas anteriores al día actual');
            }
    
            // Validación de campos obligatorios
            if (!fechaInicioEvento) {
                throw new Error('La fecha de inicio es obligatoria');
            }
            if (!fechaFinEvento) {
                throw new Error('La fecha de fin es obligatoria');
            }
            if (!horaInicio) {
                throw new Error('La hora de inicio es obligatoria');
            }
            if (!horaFin) {
                throw new Error('La hora de fin es obligatoria');
            }
            if (!empleadosSeleccionados || empleadosSeleccionados.length === 0) {
                throw new Error('Debes seleccionar al menos un empleado');
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
    
                if (empleadosSeleccionados) {
                    for (const empleado of empleadosSeleccionados) {
                        const nombre = empleado.nombre ? empleado.nombre : 'Nombre desconocido';
                        const apellido = empleado.apellido ? empleado.apellido : 'Apellido desconocido';
                        const newEvent = {
                            fechaInicio: currentDateEvent,
                            fechaFin: newEndDate,
                            horaInicio,
                            horaFin,
                            title: `Agenda de ${nombre} ${apellido}`,
                            id_empleado: empleado,
                        };
                        // console.log("Nuevo evento:", newEvent); // Verificar el nuevo evento antes de crearlo
                        const createdEvent = await agendaService.createAgenda(newEvent);
                        if (!!createdEvent?.error) {
                            throw new Error(createdEvent?.error);
                        } else {
                            newEvents.push(createdEvent);
                        }
                    }
                }
                currentDateEvent.setDate(currentDateEvent.getDate() + 1);
            }
    
            // Envía un evento de socket para notificar sobre la creación de la agenda
            socket.emit('agendaCreada', newEvents);
    
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
            swal({
                title: 'Éxito',
                text: 'La agenda ha sido creada con éxito',
                icon: 'success',
                button: 'Aceptar',
            });
            updateCalendar();
        } catch (error) {
            // Manejo de errores
            console.error('Error al crear la agenda:', error);
    
            if (errorMessage === undefined) { // Verificar si ya se estableció un mensaje de error
                errorMessage = error.message; // Establecer el mensaje de error solo si no se ha establecido previamente
            }
    
            swal({
                title: 'Error',
                text: errorMessage, // Mostrar el mensaje de error específico
                icon: 'error',
                button: 'Aceptar',
            });
        }
    };
    
    
    
    


    const [searchText, setSearchText] = useState('');
    const filteredEvents = events.filter((event) => {
        const nombreEmpleado = (event.title || '').toString().toLowerCase(); // Asegúrate de que event.title esté definido antes de llamar a toString
        // console.log('Nombre del empleado:', nombreEmpleado); // Console.log para ver el nombre del empleado

        return (
            nombreEmpleado.includes(searchText.toLowerCase()) // Filtrar por nombre del empleado
        );
    });




    const handleEventDrop = async (eventDropInfo) => {
        // Guardar las coordenadas originales del evento
        const originalStart = eventDropInfo.oldEvent.start;
        const originalEnd = eventDropInfo.oldEvent.end;
    
        try {
            const { id, start, end } = eventDropInfo.event;
            const empleadoId = eventDropInfo.event.extendedProps.id_empleado;
    
            // Validar si la fecha está fuera del día actual
            const currentDate = new Date();
            const fechaHoy = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
            // Convertir las fechas de inicio y fin a la parte de la fecha solamente
            const startOnlyDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const endOnlyDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    
            if (startOnlyDate < fechaHoy || endOnlyDate < fechaHoy) {
                // Si la fecha es anterior al día actual, restaurar las coordenadas originales del evento
                eventDropInfo.event.setDates(originalStart, originalEnd);
                throw new Error('No puedes arrastrar eventos a fechas anteriores al día actual');
            }
    
            // Verificar si la agenda está deshabilitada antes de permitir la edición
            if (!eventDropInfo.event.extendedProps.estado) {
                // Si la agenda está deshabilitada, restaurar las coordenadas originales del evento
                eventDropInfo.event.setDates(originalStart, originalEnd);
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
    
                // Verificar si hay coincidencia de horarios
                if (hayCoincidencia) {
                    // Si hay una coincidencia, restaurar las coordenadas originales del evento
                    eventDropInfo.event.setDates(originalStart, originalEnd);
                    throw new Error('No puedes arrastrar eventos donde el empleado tiene el mismo horario');
                }
            }
    
            // Actualizar la agenda en la base de datos
            const response = await agendaService.updateAgenda(eventDropInfo.event.extendedProps.id_agenda, {
                fechaInicio: start,
                fechaFin: end
            });
    
            // Verificar si hubo un error al actualizar la agenda
            if (response && response.error) {
                // Si hay un error, restaurar las coordenadas originales del evento
                eventDropInfo.event.setDates(originalStart, originalEnd);
                throw new Error(response.error);
            }
    
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
    
    



    // Después de la función handleEventDrop, agrega la siguiente función para eliminar eventos
    const handleEventDelete = async (eventId) => {
        try {
            // Eliminar el evento de la base de datos (si es necesario)
            await agendaService.deleteEvent(eventId);

            // Filtrar los eventos para excluir el evento que se va a eliminar
            const updatedEvents = events.filter((event) => event.id !== eventId);

            // Actualizar el estado local de eventos
            setEvents(updatedEvents);

            // Mostrar un mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'El evento ha sido eliminado correctamente.',
            });
        } catch (error) {
            console.error('Error al eliminar el evento:', error);
            // Mostrar un mensaje de error en caso de fallo
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al intentar eliminar el evento.',
            });
        }
    };











    const motivosPredefinidos = [
        'Enfermedad',
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
                                // deleteEvent={handleEventDelete}
                                initialView="dayGridMonth"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                                }}
                                locale={esLocale}
                                events={filteredEvents.length > 0 ? filteredEvents : events}
                                eventContent={(arg) => {
                                    const evento = arg.event;
                                    // Obtener el título del evento
                                    const tituloEvento = evento.title;
                                    // Utilizar una expresión regular para extraer el nombre del evento
                                    const nombreEmpleadoRegex = /Agenda\s(.+)/i;
                                    const match = tituloEvento.match(nombreEmpleadoRegex);
                                    const nombreEmpleado1 = match ? match[1] : 'Desconocido';
                                    // Obtener el ID del empleado seleccionado del evento
                                    const empleadoIdSeleccionado = eventoSeleccionado?.id_empleado;

                                    // Encontrar al empleado correspondiente seleccionado en el array de empleados
                                    const empleadoSeleccionado = empleados.find(
                                        (empleado) => empleado.value === empleadoIdSeleccionado
                                    );



                                    // Verificar si la agenda está deshabilitada
                                    const isDisabled = !arg.event.extendedProps.estado;

                                    // Establecer el color del evento
                                    const backgroundColor = isDisabled ? '#666666' : arg.event.backgroundColor;


                                    return (
                                        <span style={{ backgroundColor, color: 'white', padding: '2px 5px', borderRadius: '3px' }}>
                                            {isDisabled ? (
                                                <span className={`rotar-circular animacion-rotar-circular`}>🚫</span>
                                            ) : null}
                                            {isDisabled ? (
                                                <span><span style={{ color: '#FFFF11' }}>(Inac)</span> {nombreEmpleado1}</span>
                                            ) : (
                                                <span>{nombreEmpleado1}</span>
                                            )}
                                        </span>
                                    );
                                }}



                                eventClick={(clickInfo) => {
                                    // Imprimir el título del evento en la consola
                                    console.log('Título del evento:', clickInfo.event.title);
                                    const nombreEmpleadoRegex = /agenda\s(.+)/i;
                                    const match = clickInfo.event.title.match(nombreEmpleadoRegex);
                                    const nombreEmpleado = match ? match[1] : 'Desconocido';


                                    Swal.fire({
                                        title: clickInfo.event.title,
                                        html: `
                <div style="font-weight: bold;">
                    Detalles del  
                     evento<br/>
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
                                        denyButtonText: !clickInfo.event.extendedProps.estado ? '✅ Agenda' : '🚫 Agenda',
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
                                            if (disableEvent) {// Solo si se está deshabilitando
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
                                <label for="otroMotivo" id="otroMotivoLabel" style="display:none;">Ingrese el Motivo:</label>
                                <textarea id="otroMotivo" style="display:none; width: 100%; height: 100px;"></textarea>
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
                                        selectedValues={[eventoSeleccionado?.id_empleado.toString() || ""]}
                                        onChange={(selected) => {
                                            const selectedEmpleadoId = selected[0]?.value;
                                            setEventoSeleccionado({
                                                ...eventoSeleccionado,
                                                id_empleado: parseInt(selectedEmpleadoId)
                                            });
                                            console.log('Empleado seleccionado:', selectedEmpleadoId);
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