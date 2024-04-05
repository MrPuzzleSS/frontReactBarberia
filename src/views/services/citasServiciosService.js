import http from "src/http-common";

const getAll = () => {
    return http.get("/citas_servicios");
}

const getAllCitasServiciosInfo = () => {
    return http.get("/citas_servicios_info");

}

const get = id => {
    return http.get(`/citas_servicios/${id}`);
}

const create = data => {
    return http.post("/citas_servicios", data);
}

const update = (id, data) => {
    return http.put(`/citas_servicios/${id}`, data);
}

const remove = id => {
    return http.delete(`/citas_servicios/${id}`);
}

const findByTitle = title => {
    return http.get(`/citas_servicios?title=${title}`);
}

const citasServiciosDataService = {
    getAll,
    getAllCitasServiciosInfo,
    get,
    create,
    update,
    remove,
    findByTitle
}

export default citasServiciosDataService;