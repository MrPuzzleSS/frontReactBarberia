const apiUrl = 'http://localhost:8095/api/cliente';


const ClienteService = {
    getAllClientes: async () => {
        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Error al obtener los clientes: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Clientes obtenidos:', data); // Agrega este log para verificar la respuesta

            return data;
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
            throw error;
        }
    },


    getClienteById: (id) => {
        return fetch(`${apiUrl}/${id}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Error al obtener el cliente por ID:', error);
            });
    },

    createCliente: (newCliente) => {
        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCliente),
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al crear el cliente:', error);
            });
    },

    updateCliente: (id, updatedCliente) => {
        return fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCliente),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al actualizar el cliente: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error al actualizar el cliente:', error);
                throw error;  // Propagar el error para que se maneje en el componente
            });
    },


    cambiarEstadoCliente: (id) => {
        return fetch(`${apiUrl}/cambiarEstado/${id}`, {
            method: 'PUT',
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al cambiar el estado del cliente:', error);
            });
    },

    eliminarCliente: async (id_cliente) => {
        try {
            const response = await fetch(`${apiUrl}/${id_cliente}`, {
                method: 'DELETE',
                // Options such as headers, authentication, etc.
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el cliente');
            }

            return response.json();
        } catch (error) {
            throw new Error(`Error al eliminar el cliente: ${error.message}`);
        }
    },


};

export default ClienteService;
