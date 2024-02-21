import http from "src/http-common";

const getAll = () => {
    return http.get("/compras");
};

const getAllProductos = () => {
    return http.get("/producto");
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

const cambiarEstadoCompra = async (id) => {
    try {
      const response = await http.put(`/compras/${id}/cambiarEstado`, { estado: 'Pagado' });
      return response.data;
    } catch (error) {
      console.error('Error al cambiar el estado de la compra:', error);
      throw error; // Puedes manejar el error según tus necesidades
    }
  };

const CompraDataService = {
    getAll,
    getCompraDetalle,
    getAllProductos,
    get,
    create,
    update,
    remove,
    findByTitle,
    cambiarEstadoCompra
}

export default CompraDataService;