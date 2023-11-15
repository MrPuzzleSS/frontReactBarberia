const apiUrl = 'http://localhost:8095/api/agenda'; 

const AgendaService = {
  getAllAgendas: () => {
    return fetch(apiUrl)
      .then(response => response.json())
      .catch(error => {
        console.error('Error al obtener las agendas:', error);
      });
  },

  getAgendaById: (id) => {
    return fetch(`${apiUrl}/${id}`)
      .then(response => response.json())
      .catch(error => {
        console.error('Error al obtener la agenda por ID:', error);
      });
  },

  createAgenda: (newAgenda) => {
    return fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAgenda),
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error al crear la agenda:', error);
      });
  },

  updateAgenda: (id, updatedAgenda) => {
    return fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedAgenda),
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error al actualizar la agenda:', error);
      });
  },

  deleteAgenda: (id) => {
    return fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error al eliminar la agenda:', error);
      });
  },
};

export default AgendaService;
