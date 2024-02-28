import http from "src/http-common";

const getAll = () => {
    return http.get("/detalle-comprasp");
};

const get = id => {
    return http.get(`/detalle-comprasp/${id}`);
}

const create = data => {
    return http.post("/detalle-comprasp", data);
}

const update = (id, data) => {
    return http.put(`/detalle-comprasp/${id}`, data);
}

const remove = id => {
    return http.delete(`/detalle-comprasp/${id}`);
}

const findByTitle = title => {
    return http.get(`/detalle-comprasp?title=${title}`);
}

const detalleCompraProdDataService = {
    getAll,
    get,
    create,
    update,
    remove,
    findByTitle
}

export default detalleCompraProdDataService;