const apiUrl = 'http://localhost:8095/api/insumo'; // Cambiado a 'insumo'

const addAuthorizationHeader = (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
};


const InsumoService = {
    fetchWithAuthorization: async (url, options = {}) => {
        const headers = options.headers || {};
        addAuthorizationHeader(headers);

        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    },

    getAllInsumos: async () => { // Cambiado desde 'getAllClientes'
        try {
            console.log('Insumos traidos');
            return await InsumoService.fetchWithAuthorization(apiUrl);
        } catch (error) {
            console.error('Error al obtener los insumos:', error);
            throw error;
        }
    },

    getInsumoById: async (id) => { // Cambiado desde 'getClienteById'
        try {
            return await InsumoService.fetchWithAuthorization(`${apiUrl}/${id}`);
        } catch (error) {
            console.error('Error al obtener el insumo por ID:', error);
            throw error;
        }
    },

    createInsumo: async (newInsumo) => { // Cambiado desde 'createCliente'
        try {
            return await InsumoService.fetchWithAuthorization(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newInsumo),
            });
        } catch (error) {
            console.error('Error al crear el insumo:', error);
            throw error;
        }
    },

    updateInsumo: async (id, updatedInsumo) => { // Cambiado desde 'updateCliente'
        try {
            return await InsumoService.fetchWithAuthorization(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedInsumo),
            });
        } catch (error) {
            console.error('Error al actualizar el insumo:', error);
            throw error;
        }
    },

    cambiarEstadoInsumo: async (id) => { // Cambiado desde 'cambiarEstadoCliente'
        try {
            return await InsumoService.fetchWithAuthorization(`${apiUrl}/cambiarEstado/${id}`, {
                method: 'PUT',
            });
        } catch (error) {
            console.error('Error al cambiar el estado del insumo:', error);
            throw error;
        }
    },

    eliminarInsumo: async (id_insumo) => { // Cambiado desde 'eliminarCliente'
        try {
            return await InsumoService.fetchWithAuthorization(`${apiUrl}/${id_insumo}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error(`Error al eliminar el insumo: ${error.message}`);
            throw error;
        }
    },
};

export default InsumoService;
