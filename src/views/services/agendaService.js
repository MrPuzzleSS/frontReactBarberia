import axios from 'axios';
import Swal from 'sweetalert2';

const apiUrl = 'http://localhost:8095/api/agenda';

const getToken = () => {
  // Obtener el token del localStorage
  return localStorage.getItem('token');
};

const AgendaService = {
  getAllAgendas: async () => {
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${getToken()}` // Añadir el token al encabezado Authorization
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener las agendas:', error);
      throw error;
    }
  },



  getAgendaById: async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/${id}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}` // Añadir el token al encabezado Authorization
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener la agenda por ID:', error);
      throw error;
    }
  },

  createAgenda: async (newAgenda) => {
    try {
      const response = await axios.post(apiUrl, newAgenda, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}` // Añadir el token al encabezado Authorization
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear la agenda:', error);
      if (error.response && error.response.data && error.response.data.error) {
        // Si el servidor devuelve un mensaje de error específico, lo retornamos
        return error.response.data;
      } else {
        // Si no, simplemente lanzamos el error
        throw error;
      }
    }
  },


  updateAgenda: async (id, updatedAgenda) => {
    try {
      const response = await axios.put(`${apiUrl}/${id}`, updatedAgenda, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}` // Añadir el token al encabezado Authorization
        }
      });
      return response.data;
    } catch (error) {
      // Verificar si el error proviene del servidor
      if (error.response && error.response.data && error.response.data.error) {
        // Si el servidor devuelve un mensaje de error específico, lo retornamos
        return error.response.data;
      } else {
        // Si no, simplemente lanzamos el error
        console.error('Error al actualizar la agenda:', error);
        throw error;
      }
    }
  },


  deleteAgenda: async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}/${id}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}` // Añadir el token al encabezado Authorization
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al eliminar la agenda:', error);
      throw error;
    }
  },

  disableEvent: async (id, motivo, estado) => {
    const url = `${apiUrl}/${id}/disabled`;
    try {
      const response = await axios.put(url, { motivo, newEstado: estado }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}` // Añadir el token al encabezado Authorization
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al inhabilitar el evento:', error);
      throw error;
    }
  },
};

export default AgendaService;
