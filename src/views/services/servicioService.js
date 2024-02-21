const apiUrl = 'https://restapibarberia.onrender.com/api/servicio'; // Cambiar la URL de insumo a servicio

const ServicioService = { // Cambiar el nombre del objeto de InsumoService a ServicioService
    getAllServicios: async () => { // Cambiar el nombre de la función de getAllInsumos a getAllServicios
        try {
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`Error al obtener los servicios: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Servicios obtenidos:', data);

            return data;
        } catch (error) {
            console.error('Error al obtener los servicios:', error);
            throw error;
        }
    },

    getServicioById: (id) => { // Cambiar el nombre de la función de getClienteById a getServicioById
        return fetch(`${apiUrl}/${id}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Error al obtener el servicio por ID:', error);
            });
    },

    createServicio: (newServicio) => { // Cambiar el nombre de la función de createInsumo a createServicio
        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newServicio),
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al crear el servicio:', error);
            });
    },

    updateServicio: (id, updatedServicio) => { // Cambiar el nombre de la función de updateInsumo a updateServicio
        return fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedServicio),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al actualizar el servicio: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error al actualizar el servicio:', error);
                throw error;  // Propagar el error para que se maneje en el componente
            });
    },

    cambiarEstadoServicio: (id) => { // Cambiar el nombre de la función de cambiarEstadoInsumo a cambiarEstadoServicio
        return fetch(`${apiUrl}/cambiarEstado/${id}`, {
            method: 'PUT',
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al cambiar el estado del servicio:', error);
            });
    },

    eliminarServicio: async (id_servicio) => { // Cambiar el nombre de la función de eliminarInsumo a eliminarServicio
        try {
            const response = await fetch(`${apiUrl}/${id_servicio}`, {
                method: 'DELETE',
                // Options such as headers, authentication, etc.
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el servicio');
            }

            return response.json();
        } catch (error) {
            throw new Error(`Error al eliminar el servicio: ${error.message}`);
        }
    },
};

export default ServicioService; // Cambiar el nombre del export de InsumoService a ServicioService
