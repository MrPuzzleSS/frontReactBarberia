import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import swal from 'sweetalert';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import agendaService from '../../services/agendaService';
import EventReport from '../../generacionPdf/EventReport';
import interactionPlugin from '@fullcalendar/interaction';

const generateColor = (id_empleado) => {
  let color = 'gray';
  const colorArray = ['#b1ea3c','#93f2ff','#ffceff','#fffb60','#ff8199','#d68f49'];
  color = colorArray[id_empleado - 1] || color;
  return color;
};

const asignarColorXEmpleado = () => {
  let miAgenda = document.querySelectorAll('.fc-event-title');
  miAgenda.forEach((titulo) => {
    const id_empleado = titulo.innerText.split(' ')[3];
    const colorEmpleado = generateColor(id_empleado);
    console.log({titulo, id_empleado, colorEmpleado});
    titulo.style.backgroundColor = colorEmpleado;
  }); 
}

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

const CrearConfiguracion = () => {
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

      console.log('Contenido de data:', data); // Agrega este registro
      const agendas = data.agendas || [];
      console.log('empleados', empleados);

      if (Array.isArray(agendas)) {
        const formattedEvents = agendas.map((agenda) => ({
          title: `Agenda de Empleado ${empleados.length > 0 ? empleados.find((empleado) => empleado.value == agenda.id_empleado).label : agenda.id_empleado}`,
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
  
      console.log('Datos antes de la actualización en la base de datos:', { id, start, end });
      console.log('Contenido de eventDropInfo.event:', eventDropInfo.event.extendedProps.id_agenda);

      //Actualizar la base de datos con los nuevos detalles del evento
      await agendaService.updateAgenda(eventDropInfo.event.extendedProps.id_agenda, {
        fechaInicio: start,
        fechaFin: end
      });
    
      console.log('Evento actualizado en la base de datos.');

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
    } catch (error) {
      console.error('Error al actualizar el evento en la base de datos:', error);
    }
  };
  
  useEffect(() => {
    fetchAgendas();
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const response = await fetch('http://localhost:8095/api/empleado');
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
      // LITOX_2

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



            console.log('empleados', empleados);
            console.log('form', formData);
            console.log('formData.empleadosSeleccionados', formData.empleadosSeleccionados); //empleadosSeleccionados

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
      horaInicio: '00:00',
      horaFin: '01:00',
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
      const { horaInicio, horaFin, empleadosSeleccionados } = formData;
      console.log('este es el formato',formData);

      const fechaInicio = new Date(`${formData.fechaInicio}T${formData.horaInicio}`);
      const fechaFin = new Date(`${formData.fechaFin}T${formData.horaFin}`);

      // Verifica que los campos requeridos no estén vacíos
      if (!fechaInicio || !fechaFin || !horaInicio || !horaFin || empleadosSeleccionados.length === 0) {
        throw new Error('Todos los campos son obligatorios');
      }

      const newEvents = [];

      // LITOX_1


      // Recorre cada día entre la fecha de inicio y la fecha de fin
      let currentDate = new Date(fechaInicio);
      const endDate = new Date(fechaFin);

      while (currentDate <= endDate) {

        const newEndDate = new Date(currentDate);
        newEndDate.setHours(endDate.getHours(), endDate.getMinutes());

        if (empleadosSeleccionados) {
          empleadosSeleccionados.forEach(async (empleado) => {
            // Crea el objeto de evento para cada día
            const newEvent = {
              fechaInicio: currentDate,
              fechaFin: newEndDate,
              horaInicio,
              horaFin,
              id_empleado: empleado,
            };
            
            console.log({newEvent});
    
            // Envia el nuevo evento al servidor utilizando agendaService
            const createdEvent = await agendaService.createAgenda(newEvent);
    
            if (!!createdEvent?.error) {
              throw new Error(createdEvent?.error);
            } else {      
              // Agrega el evento creado a la lista de eventos locales
              newEvents.push(createdEvent);
      
            }
          });
        }
        // Incrementa la fecha para el próximo día
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Actualiza el estado de eventos con los nuevos eventos creados
      setEvents((prevEvents) => [...prevEvents, ...newEvents]);

      // Cierra el modal después de crear la agenda
      setShowCreateModal(false);

      // Limpia el formulario
      setFormData({
        fechaInicio: '',
        fechaFin: '',
        horaInicio: '',
        horaFin: '',
        empleadosSeleccionados: [],
        busquedaEmpleado: '',
      });

      // Muestra un mensaje de éxito
      swal({
        title: 'Éxito',
        text: 'La agenda ha sido creada con éxito',
        icon: 'success',
        button: 'Aceptar',
      });
    } catch (error) {
      console.error('Error al crear la agenda:', error);
      console.log('este es es error', error);

      // Muestra un mensaje de error
      swal({
        title: 'Error',
        text: 'Hubo un error al crear la agenda',
        icon: 'error',
        button: 'Aceptar',
      });
    }
   
  };


 
  
  



  return (
    <div className="container mt-6">
      <div className="row">
        <div className="col-md-4">
          <h3 className="mb-4">Configurar Agenda</h3>
          <div className="form-group">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={formData.busquedaEmpleado}
                onChange={(e) => setFormData({ ...formData, busquedaEmpleado: e.target.value })}
                placeholder="Ingrese el nombre"
              />
              <div className="input-group-append">
                <button type="button" className="btn btn-primary">
                  <i className="bi bi-search"></i> Buscar
                </button>
              </div>
            </div>
          </div>
          <form onSubmit={handleFormSubmit}>
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
            <div className="text-left mt-4">
              <button type="submit" className="btn btn-primary mr-2" style={{ marginRight: '10px' }}>
                Programar
              </button>
              <button type="button" className="btn btn-secondary" style={{ marginRight: '10px' }}>
                Cancelar
              </button>
              <EventReport events={events} />
            </div>

          </form>
        </div>


        <div className="col-md-7">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            dateClick={handleDateClick}
            eventDrop={handleEventDrop}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events}
            eventClick={(clickInfo) => {
              const empleadoSeleccionado = empleados.find(
                (empleado) => empleado.value === clickInfo.event.extendedProps.empleado
              );

              console.log('Estoy editando');
              console.log({ empleados, empleadoSeleccionado, clickInfo });

              swal({
                title: clickInfo.event.title,
                content: {
                  element: 'div',
                  attributes: {
                    innerHTML: `
                  <div style="font-weight: bold;">
                    Detalles del evento<br/>
                    Fecha de inicio: ${clickInfo.event.start.toLocaleDateString()}<br/>
                    Fecha de fin: ${clickInfo.event.end ? clickInfo.event.end.toLocaleDateString() : 'No end date'
                      }<br/>
                    Hora de inicio: ${clickInfo.event.extendedProps.horaInicio}<br/>
                    Hora de fin: ${clickInfo.event.extendedProps.horaFin}<br/>
                    Empleado: ${empleadoSeleccionado.label}
                  </div>
                `,
                  },
                },
                buttons: {
                  edit: {
                    text: 'Editar',
                    value: 'edit',
                  },
                  disable: {
                    text: !clickInfo.event.extendedProps.estado ? 'Habilitar Agenda' : 'Cancelar Agenda',
                    value: !clickInfo.event.extendedProps.estado ? 'enable' : 'disable',
                  },

                  cancel: 'Cancelar',
                },
              }).then((value) => {
                if (value === 'edit') {
                  handleEditEvent(clickInfo);
                  console.log('este es el click', clickInfo);
                  // con esto  invoco  handleEditEvent al hacer clic en "Editar"
                  setShowEditModal(true);

                } else if (value === 'disable' || value === 'enable') {
                  const disableEvent = value === 'disable';
                  swal({
                    title: `Motivo de ${disableEvent ? 'inhabilitación' : 'habilitación'}`,
                    content: 'input',
                    buttons: {
                      cancel: 'Cancelar',
                      confirm: {
                        text: disableEvent ? 'Inhabilitar' : 'Habilitar',
                        value: 'confirm',
                      },
                    },
                  }).then((motivo) => {
                    if (motivo && motivo.trim() !== '') {
                      console.log('Felicito el editón');
                      console.log('clickInfo', clickInfo.event.extendedProps.estado);
                      // Aquí realizo la llamada a la API para inhabilitar o habilitar el evento
                      agendaService
                        .disableEvent(clickInfo?.event?._def?.extendedProps?.id_agenda,
                          motivo,
                          clickInfo.event.extendedProps.estado)
                        .then((response) => {
                          console.log(`Evento ${disableEvent ? 'inhabilitado' : 'habilitado'} con motivo: ${motivo}`);
                          // Aquí logro actualizar la interfaz
                          fetchAgendas();

                          const updatedEvents = events.map((event) => {
                            if (event.id === clickInfo.event.id) {
                              return {
                                ...event,
                                extendedProps: {
                                  ...event.extendedProps,
                                  disabled: disableEvent,
                                },
                              };
                            }
                            return event;
                          });
                          setEvents(updatedEvents);
                        })
                        .catch((error) => {
                          console.error('Error al realizar la acción:', error);

                        });
                    }
                  });
                }
              });
            }}
          />
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