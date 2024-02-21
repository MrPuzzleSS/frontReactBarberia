import http from "src/http-common";

const getAll = () => {
    return http.get("/servicio");
};

const get = id => {
    return http.get(`/servicio/${id}`);
}

const create = data => {
    return http.post("/servicio", data);
}

const update = (id, data) => {
    return http.put(`/servicio/${id}`, data);
}

const cambiarEstado = (id, data) => {
    return http.put(`/servicio/${id}/cambiarestado`, data);
}

const remove = id => {
    return http.delete(`/servicio/${id}`);
}

const findByTitle = title => {
    return http.get(`/servicio?title=${title}`);
}

const ProveedoresService = {
    getAll,
    get,
    create,
    update,
    cambiarEstado,
    remove,
    findByTitle
}

export default ProveedoresService;