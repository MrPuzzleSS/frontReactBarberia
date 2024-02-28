import http from "src/http-common";

const getAll = () => {
    return http.get("/proveedores");
};

const get = id => {
    return http.get(`/proveedores/${id}`);
}

const getProveedoresProductos = id => {
    return http.get(`/proveedores/productos/${id}`);
}

const create = data => {
    return http.post("/proveedores", data);
}

const update = (id, data) => {
    return http.put(`/proveedores/${id}`, data);
}

const cambiarEstado = (id, data) => {
    return http.put(`/proveedores/${id}/cambiarestado`, data);
}

const remove = id => {
    return http.delete(`/proveedores/${id}`);
}

const findByTitle = title => {
    return http.get(`/proveedores?title=${title}`);
}

const checkExistence = async (nombre, email) => {
    const response = await getAll();
    const proveedores = response.data.listProveedores;
    console.log(proveedores);

    const nombreExists = proveedores.some(proveedor => proveedor.nombre === nombre);
    const emailExists = proveedores.some(proveedor => proveedor.email === email);

    return { nombreExists, emailExists };
};

const ProveedoresService = {
    getAll,
    get,
    getProveedoresProductos,
    create,
    update,
    cambiarEstado,
    remove,
    findByTitle,
    checkExistence
}

export default ProveedoresService;