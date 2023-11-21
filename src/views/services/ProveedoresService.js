import http from "src/http-common";

const getAll = () => {
    return http.get("/proveedores");
};

const get = id => {
    return http.get(`/proveedores/${id}`);
}

const create = data => {
    return http.post("/proveedores", data);
}

const update = (id, data) => {
    return http.put(`/proveedores/${id}`, data);
}

const remove = id => {
    return http.delete(`/proveedores/${id}`);
}

const findByTitle = title => {
    return http.get(`/proveedores?title=${title}`);
}

const ProveedoresService = {
    getAll,
    get,
    create,
    update,
    remove,
    findByTitle
}

export default ProveedoresService;