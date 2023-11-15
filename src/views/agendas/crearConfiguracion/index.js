import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import swal from 'sweetalert';
import Select from 'react-select';
import PropTypes from 'prop-types';
import agendaService from '../../services/agendaService';
import { v4 as uuidv4 } from 'uuid';

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

      if (Array.isArray(agendas)) {
        const formattedEvents = agendas.map((agenda) => ({
          title: `Agenda de ${agenda.empleado}`,
          start: new Date(agenda.fechaInicio),
          end: new Date(agenda.fechaFin),
          horaInicio: agenda.horaInicio,
          horaFin: agenda.horaFin,
          empleadoId: agenda.empleadoId,
        }));
        setEvents(formattedEvents);
        console.log(formattedEvents);
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
      const response = await fetch('http://localhost:8095/api/empleado');
      if (!response.ok) {
        throw new Error('Error al obtener los empleados');
      }
      const data = await response.json();

      if (Array.isArray(data.empleados)) {
        const empleadosData = data.empleados.map((empleado) => ({
          value: uuidv4(),
          label: `${empleado.nombre} ${empleado.apellido}`,
          empleadoId: empleado.id_empleado, // Asegúrate de que la propiedad sea id_empleado
        }));

        setEmpleados(empleadosData);
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

            const newFormData = {
              ...formData,
              fechaInicio: new Date(currentDate),
              fechaFin: newEndDate,
            };

            await agendaService.createAgenda(newFormData);
          }

          currentDate.setDate(currentDate.getDate() + 1);
        }

        swal({
          title: 'Éxito',
          text: 'Las configuraciones han sido programadas con éxito',
          icon: 'success',
          button: 'Aceptar',
        });

        fetchAgendas();
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
            eventColor={(event) => {
              switch (event.extendedProps.empleado) {
                case 'Isacc cruel':
                  return 'blue';
                case 'Simon ruinas':
                  return 'green';
                case 'bayaina':
                  return 'orange';
                case 'Deimer charrasca':
                  return 'red';
                default:
                  return 'grey';
              }
            }}
            eventClick={(clickInfo) => {
              const endDate = clickInfo.event.end ? clickInfo.event.end.toLocaleDateString() : 'No end date';
              swal({
                title: clickInfo.event.title,
                content: {
                  element: 'div',
                  attributes: {
                    innerHTML: `
                        <div style="font-weight: bold;">
                            Detalles del evento<br/>
                            Fecha de inicio: ${clickInfo.event.start.toLocaleDateString()}<br/>
                            Fecha de fin: ${endDate}<br/>
                            Hora de inicio: ${clickInfo.event.extendedProps.horaInicio}<br/>
                            Hora de fin: ${clickInfo.event.extendedProps.horaFin}<br/>
                            Empleado: ${clickInfo.event.extendedProps.empleado}
                        </div>
                    `,
                  },
                },
                button: 'Aceptar',
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CrearConfiguracion;
