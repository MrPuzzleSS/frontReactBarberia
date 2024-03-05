const apiUrl = 'https://restapibarberia.onrender.com/api/cliente';

const addAuthorizationHeader = (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
};



const addAuthorizationHeader = (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
};

const ClienteService = {
    fetchWithAuthorization: async (url, options = {}) => {
        const headers = options.headers || {};
        addAuthorizationHeader(headers);

        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    },

    getAllClientes: async () => {
        try {
            return await ClienteService.fetchWithAuthorization(apiUrl);
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
            throw error;
        }
    },

    getClienteById: async (id) => {
        try {
            return await ClienteService.fetchWithAuthorization(`${apiUrl}/${id}`);
        } catch (error) {
            console.error('Error al obtener el cliente por ID:', error);
            throw error;
        }
    },

    createCliente: async (newCliente) => {
        try {
            return await ClienteService.fetchWithAuthorization(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCliente),
            });
        } catch (error) {
            console.error('Error al crear el cliente:', error);
            throw error;
        }
    },

    updateCliente: async (id, updatedCliente) => {
        try {
            return await ClienteService.fetchWithAuthorization(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCliente),
            });
        } catch (error) {
            console.error('Error al actualizar el cliente:', error);
            throw error;
        }
    },

    cambiarEstadoCliente: async (id) => {
        try {
            return await ClienteService.fetchWithAuthorization(`${apiUrl}/cambiarEstado/${id}`, {
                method: 'PUT',
            });
        } catch (error) {
            console.error('Error al cambiar el estado del cliente:', error);
            throw error;
        }
    },

    eliminarCliente: async (id_cliente) => {
        try {
            return await ClienteService.fetchWithAuthorization(`${apiUrl}/${id_cliente}`, {
                method: 'DELETE',
                // Options such as headers, authentication, etc.
            });
        } catch (error) {
            console.error(`Error al eliminar el cliente: ${error.message}`);
            throw error;
        }
    },
};

export default ClienteService;
