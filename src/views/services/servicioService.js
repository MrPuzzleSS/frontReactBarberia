    // servicioService.js
    import axios from 'axios';

    const apiUrl = 'http://localhost:8095/api/servicio';

    const getToken = () => {
        return localStorage.getItem('token');
    };

    const ServicioService = {
        getAllServicios: async () => {
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Error al obtener los servicios:', error);
                throw new Error(`Error al obtener los servicios: ${error.message}`);
            }
        },

        getServicioById: async (id) => {
            try {
                const response = await axios.get(`${apiUrl}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Error al obtener el servicio por ID:', error);
                throw new Error(`Error al obtener el servicio por ID: ${error.message}`);
            }
        },

        createServicio: async (newServicio) => {
            try {
                const response = await axios.post(apiUrl, newServicio, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Error al crear el servicio:', error);
                throw new Error(`Error al crear el servicio: ${error.message}`);
            }
        },

        updateServicio: async (id, updatedServicio) => {
            try {
                const response = await axios.put(`${apiUrl}/${id}`, updatedServicio, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Error al actualizar el servicio:', error);
                throw new Error(`Error al actualizar el servicio: ${error.message}`);
            }
        },

        cambiarEstadoServicio: async (id) => {
            try {
                const response = await axios.put(`${apiUrl}/cambiarEstado/${id}`, null, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Error al cambiar el estado del servicio:', error);
                throw new Error(`Error al cambiar el estado del servicio: ${error.message}`);
            }
        },

        eliminarServicio: async (id_servicio) => {
            try {
                const response = await axios.delete(`${apiUrl}/${id_servicio}`, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                });
                return response.data;
            } catch (error) {
                console.error(`Error al eliminar el servicio: ${error.message}`);
                throw new Error(`Error al eliminar el servicio: ${error.message}`);
            }
        },
    };

    export default ServicioService;
