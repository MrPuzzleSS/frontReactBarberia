import http from "src/http-common";

const getAll = () => {
    return http.get("/citas");
}

const getAllCitasAgendadas = () => {
    return http.get("/citas/agendadas");
    
}

const getAllCitasServicios = (id) => {
    return http.get(`/citas/servicios/${id}`);

}

const get = id => {
    return http.get(`/citas/${id}`);
}

const getEmpleado = id => {
    return http.get(`/empleado/${id}`);

}

const getEmpleadoAgendas = id => {
    return http.get(`/empleado/agendas/${id}`);

}

const create = data => {
    return http.post("/citas", data);
}

const update = (id, data) => {  
    return http.put(`/citas/${id}`, data);
}

const remove = id => {
    return http.delete(`/citas/${id}`);
}

const findByTitle = title => {
    return http.get(`/citas?title=${title}`);
}

const cambiarEstadoCita = async (id) => {
    try {
      const response = await http.put(`/citas/${id}/cambiarEstado`, { estado: 'Cancelada' });
      return response.data;
    } catch (error) {
      console.error('Error al cambiar el estado de la cita:', error);
      throw error; // Puedes manejar el error según tus necesidades
    }
  }

const CitasDataService = {
    getAll,
    getAllCitasAgendadas,
    getAllCitasServicios,
    getEmpleadoAgendas,
    get,
    getEmpleado,
    create,
    update,
    remove,
    findByTitle,
    cambiarEstadoCita
}

export default CitasDataService;