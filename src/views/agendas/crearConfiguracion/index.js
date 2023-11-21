import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import swal from 'sweetalert';
import Select from 'react-select';
import PropTypes from 'prop-types';
import agendaService from '../../services/agendaService';

const MultiSelect = ({ options, selectedValues, onChange }) => {
  const handleChange = (selectedOption) => {
    onChange(selectedOption);
  };

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

  useEffect(() => {
    fetchAgendas();
    fetchEmpleados();
  }, []);

  const generateColor = (empleado) => {
    if (empleado && empleado.id) {
      const colorHash = empleado.id
        .split('')
        .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
      return `hsl(${colorHash % 360}, 100%, 50%)`;
    }
    return 'hsl(0, 100%, 50%)';
  };

  const fetchAgendas = async () => {
    try {
      const data = await agendaService.getAllAgendas();

      console.log('Contenido de data:', data); // Agrega este registro

      const agendas = data.agendas || [];

      console.log('empleados', empleados);

      if (Array.isArray(agendas)) {
        const formattedEvents = agendas.map((agenda) => ({
          title: `Agenda de ${empleados.length > 0 ? empleados.find((empleado) => empleado.value == agenda.id_empleado).label : agenda.id_empleado}`,
          start: new Date(agenda.fechaInicio),
          end: new Date(agenda.fechaFin),
          horaInicio: agenda.horaInicio,
          horaFin: agenda.horaFin,
          empleado: agenda.id_empleado,
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


  const fetchEmpleados = async () => {
    try {
      const apiUrl = 'https://resapibarberia.onrender.com/api/empleado';
      const response = await fetch('');
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

            // const newFormData = {
            //   ...formData,
            //   fechaInicio: new Date(currentDate),
            //   fechaFin: newEndDate,
            // };

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
                  // title: `Agenda de ${barbero.label}`,
                };

                console.log('newEvent', newEvent);

                await agendaService.createAgenda(newEvent); // ¿Se necesita esto aquí? newFormData
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
          text: 'Las configuraciones han sido programadas con éxito',
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
              <label>Hora</label>
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
              <button type="button" className="btn btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
        <div className="col-md-7">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events}
            eventClick={(clickInfo) => {
              const empleadoSeleccionado = empleados.find((empleado) => empleado.value === clickInfo.event.extendedProps.empleado);

              swal({
                title: clickInfo.event.title,
                content: {
                  element: 'div',
                  attributes: {
                    innerHTML: `
            <div style="font-weight: bold;">
              Detalles del evento<br/>
              Fecha de inicio: ${clickInfo.event.start.toLocaleDateString()}<br/>
              Fecha de fin: ${clickInfo.event.end ? clickInfo.event.end.toLocaleDateString() : 'No end date'}<br/>
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
                    text: clickInfo.event.extendedProps.disabled ? 'Habilitar' : 'Inhabilitar',
                    value: clickInfo.event.extendedProps.disabled ? 'enable' : 'disable',
                  },
                  cancel: 'Cancelar',
                },
              }).then((value) => {
                if (value === 'edit') {
                  // Lógica para editar evento
                  // Por ejemplo, abrir modal o formulario de edición
                  console.log('Editar evento:', clickInfo.event);
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
                      // Aquí realizas la llamada a la API para inhabilitar o habilitar el evento
                      agendaService.disableEvent(clickInfo.event.id, motivo)
                        .then((response) => {
                          console.log(`Evento ${disableEvent ? 'inhabilitado' : 'habilitado'} con motivo: ${motivo}`);
                          // Aquí podrías actualizar la interfaz
                          fetchAgendas();
                    
                          const updatedEvents = events.map(event => {
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
                          
                          // Manejo del error de JSON no válido
                          try {
                            const errorMessage = JSON.parse(error.response.data); // Si la respuesta tiene JSON inválido
                            console.error('Error JSON:', errorMessage);
                          } catch (jsonError) {
                            console.error('Error no parseable como JSON:', error.response.data);
                          }
                        });
                    }
                    
                  });
                }
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CrearConfiguracion;