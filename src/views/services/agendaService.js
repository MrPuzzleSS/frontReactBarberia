const apiUrl = 'http://localhost:8095/api/agenda';

const AgendaService = {
  
  getAllAgendas: () => {
    return fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener las agendas');
        }
        return response.json();
      })
      .then(data => {
        console.log('Agendas obtenidas correctamente:', data);
        return data;
      })
      .catch(error => {
        console.error('Error al obtener las agendas:', error);
        throw error; // Propaga el error para que pueda ser manejado en otro lugar
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

    disableEvent: async (id, motivo, estado) => {
      const url = `${apiUrl}/${id}/disabled`;
    
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ motivo, newEstado: estado }), 
      };
    
      try {
        const response = await fetch(url, requestOptions);
    
        if (!response.ok) {
          throw new Error('Error al inhabilitar el evento');
        
        }
    
        const data = await response.json();
        // Aquí puedes manejar la respuesta exitosa del servidor
        console.log('Evento inhabilitado exitosamente:', data);
        return data; // Retorna la respuesta o realiza alguna acción adicional si es necesario
      } catch (error) {
        console.error('Error al inhabilitar el evento:', error);
        
        throw error; // Propaga el error para manejarlo en otro lugar si es necesario
      }
    },
    
  };

export default AgendaService;
