import http from "src/http-common";

const getAll = () => {
    return http.get("/detalle-compras");
};

const get = id => {
    return http.get(`/detalle-compras/${id}`);
}

const create = data => {
    return http.post("/detalle-compras", data);
}

const update = (id, data) => {
    return http.put(`/detalle-compras/${id}`, data);
}

const remove = id => {
    return http.delete(`/detalle-compras/${id}`);
}

const findByTitle = title => {
    return http.get(`/detalle-compras?title=${title}`);
}

const detalleCompraDataService = {
    getAll,
    get,
    create,
    update,
    remove,
    findByTitle
}

export default detalleCompraDataService;