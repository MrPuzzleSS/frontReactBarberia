import http from "src/http-common";

const getAll = () => {
    return http.get("/empleado");
};

const getEmpleadoAgenda = id => {
    return http.get(`/agenda/empleado/${id}`);
}

const ServicioBarbero = {
    getAll,
    getEmpleadoAgenda
}

export default ServicioBarbero