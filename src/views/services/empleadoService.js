const apiUrl = 'https://restapibarberia.onrender.com/api/empleado';

const EmpleadoService = {
    getAllEmpleados: () => {
        const token = localStorage.getItem('token');
        return fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al obtener los empleados:', error);
            });
    },

    getEmpleadoById: (id) => {
        const token = localStorage.getItem('token');
        return fetch(`${apiUrl}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al obtener el empleado por ID:', error);
            });
    },

    createEmpleado: (newEmpleado) => {
        const token = localStorage.getItem('token');
        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newEmpleado),
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al crear el empleado:', error);
            });
    },

    updateEmpleado: (id, updatedEmpleado) => {
        const token = localStorage.getItem('token');
        return fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedEmpleado),
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al actualizar el empleado:', error);
            });
    },

    cambiarEstadoEmpleado: (id) => {
        const token = localStorage.getItem('token');
        return fetch(`${apiUrl}/cambiarEstado/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al cambiar el estado del empleado:', error);
            });
    },

    eliminarEmpleado: (id) => {
        const token = localStorage.getItem('token');
        return fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al eliminar el empleado:', error);
            });
    },

};

export default EmpleadoService;
