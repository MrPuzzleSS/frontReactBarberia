import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Swal from 'sweetalert2';
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






const CrearConfiguracion = () => {

    const colorArray = [
        '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
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

    const asignarColorXEmpleado = () => {
        const miAgenda = document.querySelectorAll('.fc-event-title');
        miAgenda.forEach((titulo) => {
            const id_empleado = titulo.innerText.split(' ')[3];
            const colorEmpleado = generateColor(id_empleado);
            titulo.style.backgroundColor = colorEmpleado;
        });
    };

    asignarColorXEmpleado();


    const MultiSelect = ({ options, selectedValues, onChange }) => {
        const handleChange = (selectedOption) => {
            onChange(selectedOption);
        };

        console.log('Soy felix', options, selectedValues, onChange);
        const selectedOptions = options.filter((option) => selectedValues.includes(option.value));

        asignarColorXEmpleado();

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

    const fetchAgendas = async () => {
        try {
            const data = await agendaService.getAllAgendas();
            const agendas = data.agendas || [];

            if (Array.isArray(agendas)) {
                const formattedEvents = agendas.map((agenda) => ({
                    title: `Agenda de Empleado ${empleados.length > 0 ? empleados.find((empleado) => empleado.value === agenda.id_empleado).label : agenda.id_empleado}`,
                    start: new Date(agenda.fechaInicio),
                    end: new Date(agenda.fechaFin),
                    horaInicio: agenda.horaInicio,
                    horaFin: agenda.horaFin,
                    empleado: agenda.id_empleado,
                    id_agenda: agenda.id_agenda,
                    estado: agenda.estado,
                    editable: true,
                }));

                setEvents(formattedEvents);
            } else {
                console.error('Las agendas no se obtuvieron como un array:', data);
                console.log('Estructura de las agendas:', data);
            }
        } catch (error) {
            console.error('Error al obtener las agendas:', error);
        }
    };

    const handleEventDrop = async (eventDropInfo) => {
        try {
            const { id, start, end } = eventDropInfo.event;

            // Validar si la fecha está fuera del día actual
            const currentDate = new Date();
            const fechaHoy = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Fecha actual sin hora

            if (start < fechaHoy || end < fechaHoy) {
                throw new Error('No puedes arrastrar eventos a fechas anteriores al día actual');
            }

            // Verificar si la agenda está deshabilitada antes de permitir la edición
            if (eventDropInfo.event.extendedProps.estado === false) {
                throw new Error('No puedes editar una agenda deshabilitada');
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




    useEffect(() => {
        fetchAgendas();
        fetchEmpleados();
    }, []);




    const fetchEmpleados = async () => {
        try {
            const response = await fetch('https://resapibarberia.onrender.com/api/empleado');
            if (!response.ok) {
                throw new Error('Error al obtener los empleados');
            }
            const data = await response.json();

            if (Array.isArray(data.empleados)) {
                const formattedEmpleados = data.empleados.map((empleado) => ({
                    value: empleado.id_empleado, // Asegúrate de convertir el ID a cadena
                    label: `${empleado.nombre} ${empleado.apellido}`,
                    // Otros datos del empleado...
                }));
                setEmpleados(formattedEmpleados);
            } else {
                console.error('La propiedad empleados no contiene un array:', data);
            }
        } catch (error) {
            console.error('Error al obtener empleados:', error);
        }
    };

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
                                // Crear el evento con el empleado seleccionado
                                const newEvent = {
                                    id_empleado: parseInt(barbero.value),
                                    fechaInicio: new Date(currentDate),
                                    fechaFin: newEndDate,
                                    horaInicio: formData.horaInicio,
                                    horaFin: formData.horaFin
                                };

                                console.log('newEvent', newEvent);

                                await agendaService.createAgenda(newEvent);
                                // Agregar el nuevo evento a la lista de eventos
                                setEvents((prevEvents) => [...prevEvents, newEvent]);

                            })
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

            // Validación de fechas anteriores al día actual
            if (fechaInicioEvento < fechaHoy || fechaFinEvento < fechaHoy) {
                throw new Error('No puedes crear eventos en fechas anteriores al día actual');
            } else {
                // Validación de campos obligatorios
                if (!fechaInicioEvento || !fechaFinEvento || !horaInicio || !horaFin || empleadosSeleccionados.length === 0) {
                    throw new Error('Todos los campos son obligatorios');
                }

                // Validación de horas de inicio y fin
                if (horaInicio > horaFin) {
                    throw new Error('La hora de inicio no puede ser posterior a la hora de fin');
                }

                  // Validación de horas de inicio y fin
                  if (!empleadosSeleccionados > empleadosSeleccionados) {
                    throw new Error('El campo del empleado es requerido');
                }



                // Validación de fechas de inicio y fin
                if (fechaInicioEvento > fechaFinEvento) {
                    throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin');
                }

                // Validación de campos obligatorios
                if (!fechaInicioEvento || !fechaFinEvento || !horaInicio || !horaFin || empleadosSeleccionados.length === 0) {
                    throw new Error('Todos los campos son obligatorios');
                }


                // Resto del código para la creación de eventos...
                const newEvents = [];
                let currentDateEvent = new Date(fechaInicioEvento);

                while (currentDateEvent <= fechaFinEvento) {
                    const newEndDate = new Date(currentDateEvent);
                    newEndDate.setHours(fechaFinEvento.getHours(), fechaFinEvento.getMinutes());

                    if (empleadosSeleccionados) {
                        empleadosSeleccionados.forEach(async (empleado) => {
                            const newEvent = {
                                fechaInicio: currentDateEvent,
                                fechaFin: newEndDate,
                                horaInicio,
                                horaFin,
                                title: `Agenda de ${empleado.nombre} ${empleado.apellido}`,
                                id_empleado: empleado,
                            };
                            const createdEvent = await agendaService.createAgenda(newEvent);
                            if (!!createdEvent?.error) {
                                throw new Error(createdEvent?.error);
                            } else {
                                newEvents.push(createdEvent);
                            }
                        });
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
                swal({
                    title: 'Éxito',
                    text: 'La agenda ha sido creada con éxito',
                    icon: 'success',
                    button: 'Aceptar',
                });
                updateCalendar();
            }
        } catch (error) {
            // Manejo de errores
            console.error('Error al crear la agenda:', error);
            swal({
                title: 'Error',
                text: error.message, // Mostrar el mensaje de error específico
                icon: 'error',
                button: 'Aceptar',
            });
        }
    };






    const [searchText, setSearchText] = useState(''); // Estado para almacenar el texto de búsqueda
    const filteredEvents = events.filter((event) => {
        const nombreEmpleado = event.title.toLowerCase(); // Obtener el nombre del empleado del título del evento
        console.log('Nombre del empleado:', nombreEmpleado); // Console.log para ver el nombre del empleado

        return (
            nombreEmpleado.includes(searchText.toLowerCase()) // Filtrar por nombre del empleado
        );
    });

    const motivosPredefinidos = [
        'Enfermedad',
        'Emergencia familiar',
        ''

        // Agrega más motivos según sea necesario
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
                                eventClick={(clickInfo) => {
                                    const empleadoSeleccionado = empleados.find(
                                        (empleado) => empleado.value === clickInfo.event.extendedProps.empleado
                                    );
                                    Swal.fire({
                                        title: clickInfo.event.title,
                                        html: `
                <div style="font-weight: bold;">
                    Detalles del evento<br/>
                    Fecha de inicio: ${clickInfo.event.start.toLocaleDateString()}<br/>
                    Fecha de fin: ${clickInfo.event.end ? clickInfo.event.end.toLocaleDateString() : 'No end date'}<br/>
                    Hora de inicio: ${clickInfo.event.extendedProps.horaInicio}<br/>
                    Hora de fin: ${clickInfo.event.extendedProps.horaFin}<br/>
                    Empleado: ${empleadoSeleccionado.label}
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
                                            Swal.fire({
                                                title: `Motivo de ${disableEvent ? 'habilitación' : 'inhabilitación'}`,
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
                                                confirmButtonText: disableEvent ? 'Habilitar' : 'Inhabilitar',
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
                                                        // Resto del código para habilitar o inhabilitar el evento con el motivo proporcionado
                                                        const disableEvent = !clickInfo.event.extendedProps.estado;
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
                                                                                estado: disableEvent ? true : false,
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
                    <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
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