<<<<<<< HEAD
import axios from 'axios';
=======
const apiUrl = 'https://restapibarberia.onrender.com/api/producto';
const apiUrlProveedores = 'https://restapibarberia.onrender.com/api/proveedores';

const ProductoService = {



    createProducto: async (newProducto) => {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProducto),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error al crear el producto: ${errorData.error}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error al crear el producto:', error);
            throw new Error(`Error al crear el producto: ${error.message}`);
        }
    },

    getAllProductos: async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Error al obtener los productos');
            }
            const data = await response.json();

            // Obtener información del proveedor para cada producto
            const productosConProveedor = await Promise.all(
                data.productos.map(async (producto) => {
                    try {
                        const responseProveedor = await fetch(`${apiUrlProveedores}/${producto.id_proveedor}`);
                        if (!responseProveedor.ok) {
                            throw new Error('Error al obtener el proveedor del producto');
                        }
                        const proveedor = await responseProveedor.json();
                        return { ...producto, proveedor };
                    } catch (error) {
                        console.error('Error al obtener el proveedor del producto:', error);
                        return { ...producto, proveedor: null };
                    }
                })
            );

            return { productos: productosConProveedor };
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            throw new Error(`Error al obtener los productos: ${error.message}`);
        }
    },

    getProductoById: async (id) => {
        try {
            const response = await fetch(`${apiUrl}/${id}`);
            if (!response.ok) {
                throw new Error('Error al obtener el producto por ID');
            }
            return response.json();
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            throw new Error(`Error al obtener el producto por ID: ${error.message}`);
        }
    },


    updateProducto: async (id, updatedProducto) => {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProducto),
            });

            console.log('URL de solicitud:', `${apiUrl}/${id}`);
            console.log('Datos enviados:', JSON.stringify(updatedProducto));
            console.log('Estado de la respuesta:', response.status);

            if (!response.ok) {
                throw new Error('Error al actualizar el producto');
            }

            const responseData = await response.json();
            console.log('Datos de respuesta:', responseData);

            return responseData;
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    },

    putProducto: async (id, estado) => {
        try {
            console.log('Ruta de solicitud:', `${apiUrl}/${id}`); // Agrega este console.log()
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado }),
            });
            if (!response.ok) {
                throw new Error('Error al cambiar el estado del producto');
            }
            return response.json();
        } catch (error) {
            console.error('Error al cambiar el estado del producto:', error);
            throw new Error(`Error al cambiar el estado del producto: ${error.message}`);
        }
    },

    eliminarProducto: async (id_producto) => {
        try {
            const response = await fetch(`${apiUrl}/${id_producto}`, {
                method: 'DELETE',
                // Opciones como headers, autenticación, etc.
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el producto');
            }

            return response.json();
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    },

    obtenerProveedores: async () => {
        try {
            const response = await fetch(apiUrlProveedores);
            if (!response.ok) {
                throw new Error('Error al obtener los proveedores');
            }
            const data = await response.json();

            // Verifica si la respuesta tiene el campo listProveedores con un array
            if (data && Array.isArray(data.listProveedores)) {
                return data.listProveedores; // Devuelve el array de proveedores
            } else {
                throw new Error('La respuesta no tiene la estructura esperada');
            }
        } catch (error) {
            console.error('Error al obtener los proveedores:', error);
            throw new Error(`Error al obtener los proveedores: ${error.message}`);
        }
    },

>>>>>>> 65c5a2735816b147c6eae7b3e5d12b8639bd95b9

const apiUrl = 'http://localhost:8095/api/producto';
const apiUrlProveedores = 'http://localhost:8095/api/proveedores';

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
      const productos = response.data.productos;

      // Obtener información del proveedor para cada producto
      const productosConProveedor = await Promise.all(
        productos.map(async (producto) => {
          try {
            const responseProveedor = await axios.get(`${apiUrlProveedores}/${producto.id_proveedor}`, {
              headers: {
                'Authorization': `Bearer ${getToken()}`
              }
            });
            const proveedor = responseProveedor.data;
            return { ...producto, proveedor };
          } catch (error) {
            console.error('Error al obtener el proveedor del producto:', error);
            return { ...producto, proveedor: null };
          }
        })
      );

      return { productos: productosConProveedor };
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

  obtenerProveedores: async () => {
    try {
      const response = await axios.get(apiUrlProveedores, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      if (response.data && Array.isArray(response.data.listProveedores)) {
        return response.data.listProveedores;
      } else {
        throw new Error('La respuesta no tiene la estructura esperada');
      }
    } catch (error) {
      console.error('Error al obtener los proveedores:', error);
      throw new Error(`Error al obtener los proveedores: ${error.message}`);
    }
  },
};

export default ProductoService;
