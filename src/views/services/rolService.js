const apiUrl = 'https://resapibarberia.onrender.com/api/rol'; 

const RolService = {
  getAllRoles: async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Error al obtener los roles');
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getRolById: async (id) => {
    try {
      const response = await fetch(`${apiUrl}/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener el rol por ID');
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  createRol: async (newRol) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRol),
      });
      if (!response.ok) {
        throw new Error('Error al crear el rol');
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateRol: async (id, updatedRol) => {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRol),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el rol');
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  deleteRol: async (id) => {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el rol');
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default RolService;
