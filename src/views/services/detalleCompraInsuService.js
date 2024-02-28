import http from "src/http-common";

const getAll = () => {
    return http.get("/detalle-comprasin");
};

const get = id => {
    return http.get(`/detalle-comprasin/${id}`);
}

const create = data => {
    return http.post("/detalle-comprasin", data);
}

const update = (id, data) => {
    return http.put(`/detalle-comprasin/${id}`, data);
}

const remove = id => {
    return http.delete(`/detalle-comprasin/${id}`);
}

const findByTitle = title => {
    return http.get(`/detalle-comprasin?title=${title}`);
}

const detalleCompraInsuDataService = {
    getAll,
    get,
    create,
    update,
    remove,
    findByTitle
}

export default detalleCompraInsuDataService;