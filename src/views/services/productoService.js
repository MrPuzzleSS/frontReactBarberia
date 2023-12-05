const apiUrl = 'http://localhost:8095/api/producto';
const apiUrlProveedores = 'http://localhost:8095/api/proveedores'; 

const ProductoService = {
    getAllProductos: () => {
        return fetch(apiUrl)
            .then(response => response.json())
            .catch(error => {
                console.error('Error al obtener los productos:', error);
            });
    },

    getProductoById: (id) => {
        return fetch(`${apiUrl}/${id}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Error al obtener el producto por ID:', error);
            });
    },

    createProducto: (newProducto) => {
        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProducto),
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al crear el producto:', error);
            });
    },

    updateProducto: (id, updatedProducto) => {
        console.log(updatedProducto, "Carga este")
        return fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProducto),
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al actualizar el producto:', error);
            });
    },

    cambiarEstadoProducto: (id) => {
        return fetch(`${apiUrl}/cambiarEstado/${id}`, {
            method: 'PUT',
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al cambiar el estado del producto:', error);
            });
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

    obtenerProveedores: () => {
        return fetch(apiUrlProveedores) // Utiliza la URL para obtener proveedores
            .then(response => response.json())
            .catch(error => {
                console.error('Error al obtener los proveedores:', error);
            });
    },
};



export default ProductoService;
