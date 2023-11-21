<<<<<<< HEAD
const apiUrl = 'http://localhost:8095/api/agenda';
=======
const apiUrl = 'http://localhost:8095/api/agenda'; 
>>>>>>> cffcdf157e7cb4b875a4ac3eedfea414a560d54d

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
<<<<<<< HEAD

 

  disableEvent: (id, motivo) => {
    const url = `${apiUrl}/${id}/disable`;

    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ motivo }),
    };

    return fetch(url, requestOptions)
      .then(response => response.json())
      .catch(error => {
        console.error('Error al inhabilitar el error  de errores :', error);
        throw error;
      });
  },
};
  
=======
};
>>>>>>> cffcdf157e7cb4b875a4ac3eedfea414a560d54d

export default AgendaService;
