const apiUrl = 'https://resapibarberia.onrender.com/api/empleado';

const EmpleadoService = {
    getAllEmpleados: () => {
        return fetch(apiUrl)
            .then(response => response.json())
            .catch(error => {
                console.error('Error al obtener los empleados:', error);
            });
    },

    getEmpleadoById: (id) => {
        return fetch(`${apiUrl}/${id}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Error al obtener el empleado por ID:', error);
            });
    },

    createEmpleado: (newEmpleado) => {
        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEmpleado),
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al crear el empleado:', error);
            });
    },

    updateEmpleado: (id, updatedEmpleado) => {
        console.log(updatedEmpleado, "Carga este")
        return fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEmpleado),
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al actualizar el empleado:', error);
            });
    },

    cambiarEstadoEmpleado: (id) => {
        return fetch(`${apiUrl}/cambiarEstado/${id}`, {
            method: 'PUT',
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al cambiar el estado del empleado:', error);
            });
    },
};

export default EmpleadoService;