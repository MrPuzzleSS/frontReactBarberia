import axios from 'axios';

const apiUrl = 'https://restapibarberia.onrender.com/api/producto';

const getToken = () => {
  // Obtener el token del localStorage
  return localStorage.getItem('token');
};

const ProductoService = {
  createProducto: async (newProducto) => {
    try {
      const response = await axios.post(apiUrl, newProducto, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear el producto:', error);
      throw new Error(`Error al crear el producto: ${error.message}`);
    }
  },
  getAllProductos: async () => {
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      throw new Error(`Error al obtener los productos: ${error.message}`);
    }
  },

  getProductoById: async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/${id}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener el producto por ID:', error);
      throw new Error(`Error al obtener el producto por ID: ${error.message}`);
    }
  },

  updateProducto: async (id, updatedProducto) => {
    try {
      const response = await axios.put(`${apiUrl}/${id}`, updatedProducto, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  },

  putProducto: async (id, estado) => {
    try {
      const response = await axios.put(`${apiUrl}/${id}`, { estado }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al cambiar el estado del producto:', error);
      throw new Error(`Error al cambiar el estado del producto: ${error.message}`);
    }
  },

  eliminarProducto: async (id_producto) => {
    try {
      const response = await axios.delete(`${apiUrl}/${id_producto}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  },
};

export default ProductoService;
