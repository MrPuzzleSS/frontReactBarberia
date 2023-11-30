import http from "src/http-common";

const getAll = () => {
    return http.get("/compras");
};

const getCompraDetalle = () => {
    return http.get("/compras/detalles")
}

const get = id => {
    return http.get(`/compras/${id}`);
}

const create = data => {
    return http.post("/compras", data);
}

const update = (id, data) => {
    return http.put(`/compras/${id}`, data);
}

const remove = id => {
    return http.delete(`/compras/${id}`);
}

const findByTitle = title => {
    return http.get(`/compras?title=${title}`);
}

const cambiarEstadoCompra = id => {
    return http.put(`/compra/${id}/cambiarEstado`)
}

const CompraDataService = {
    getAll,
    getCompraDetalle,
    get,
    create,
    update,
    remove,
    findByTitle,
    cambiarEstadoCompra
}

export default CompraDataService;