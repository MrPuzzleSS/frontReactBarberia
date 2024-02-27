const apiUrl = 'http://localhost:8095/api/insumo';


const InsumoService = {
    getAllInsumos: async () => {
        try {
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`Error al obtener los insumos: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Insumos obtenidos:', data);

            return data;
        } catch (error) {
            console.error('Error al obtener los insumos:', error);
            throw error;
        }
    },

    getClienteById: (id) => {
        return fetch(`${apiUrl}/${id}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Error al obtener el insumo por ID:', error);
            });
    },

    createInsumo: (newInsumo) => {
        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newInsumo),
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al crear el insumo:', error);
            });
    },

    updateInsumo: (id, updatedInsumo) => {
        return fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedInsumo),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al actualizar el insumo: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error al actualizar el insumo:', error);
                throw error;  // Propagar el error para que se maneje en el componente
            });
    },


    cambiarEstadoInsumo: (id) => {
        return fetch(`${apiUrl}/cambiarEstado/${id}`, {
            method: 'PUT',
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al cambiar el estado del insumo:', error);
            });
    },

    eliminarInsumo: async (id_insumo) => {
        try {
            const response = await fetch(`${apiUrl}/${id_insumo}`, {
                method: 'DELETE',
                // Options such as headers, authentication, etc.
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el insumo');
            }

            return response.json();
        } catch (error) {
            throw new Error(`Error al eliminar el insumo: ${error.message}`);
        }
    },
};

export default InsumoService;
