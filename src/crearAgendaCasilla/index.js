
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
    const { fechaInicio, fechaFin, horaInicio, horaFin, empleadosSeleccionados } = formData;

    // Verifica que los campos requeridos no estén vacíos
    if (!fechaInicio || !fechaFin || !horaInicio || !horaFin || empleadosSeleccionados.length === 0) {
      throw new Error('Todos los campos son obligatorios');
    }

    const newEvents = [];

    // Recorre cada día entre la fecha de inicio y la fecha de fin
    let currentDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    while (currentDate <= endDate) {
      // Crea el objeto de evento para cada día
      const newEvent = {
        fechaInicio: currentDate.toISOString(),
        fechaFin: new Date(currentDate.getTime() + (1 * 24 * 60 * 60 * 1000)).toISOString(),
        horaInicio,
        horaFin,
        empleadosSeleccionados,
      };

      // Envia el nuevo evento al servidor utilizando agendaService
      const createdEvent = await agendaService.createAgenda(newEvent);

      // Agrega el evento creado a la lista de eventos locales
      newEvents.push(createdEvent);

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
    // Muestra un mensaje de error
    swal({
      title: 'Error',
      text: 'Hubo un error al crear la agenda',
      icon: 'error',
      button: 'Aceptar',
    });
  }
};

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
</Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={handleCloseCreateModal}>
    Cancelar
  </Button>
  <Button variant="primary" onClick={handleCloseCreateModal}>
    Crear Agenda
  </Button>
</Modal.Footer>
</Modal>