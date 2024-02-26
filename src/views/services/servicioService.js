// servicioService.js

const apiUrl = 'http://localhost:8095/api/servicio'; // Cambia la URL base a la de servicios

const addAuthorizationHeader = (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
};

const ServicioService = {
    fetchWithAuthorization: async (url, options = {}) => {
        const headers = options.headers || {};
        addAuthorizationHeader(headers);

        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    },

    getAllServicios: async () => {
        try {
            return await ServicioService.fetchWithAuthorization(apiUrl);
        } catch (error) {
            console.error('Error al obtener los servicios:', error);
            throw error;
        }
    },

    getServicioById: async (id) => {
        try {
            return await ServicioService.fetchWithAuthorization(`${apiUrl}/${id}`);
        } catch (error) {
            console.error('Error al obtener el servicio por ID:', error);
            throw error;
        }
    },

    createServicio: async (newServicio) => {
        try {
            return await ServicioService.fetchWithAuthorization(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newServicio),
            });
        } catch (error) {
            console.error('Error al crear el servicio:', error);
            throw error;
        }
    },

    updateServicio: async (id, updatedServicio) => {
        try {
            return await ServicioService.fetchWithAuthorization(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedServicio),
            });
        } catch (error) {
            console.error('Error al actualizar el servicio:', error);
            throw error;
        }
    },

    cambiarEstadoServicio: async (id) => {
        try {
            return await ServicioService.fetchWithAuthorization(`${apiUrl}/cambiarEstado/${id}`, {
                method: 'PUT',
            });
        } catch (error) {
            console.error('Error al cambiar el estado del servicio:', error);
            throw error;
        }
    },

    eliminarServicio: async (id_servicio) => {
        try {
            return await ServicioService.fetchWithAuthorization(`${apiUrl}/${id_servicio}`, {
                method: 'DELETE',
                // Options such as headers, authentication, etc.
            });
        } catch (error) {
            console.error(`Error al eliminar el servicio: ${error.message}`);
            throw error;
        }
    },
};

export default ServicioService;
