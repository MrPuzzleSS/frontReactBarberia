const api_url = 'http://localhost:8095/api/venta';

const VentaService = {
    getVentas: () => {
        return fetch(`${api_url}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al obtener las ventas: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error al obtener las ventas:', error.message);
            });
    },

    crearVenta: (nuevaVenta) => {
        return fetch(`${api_url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nueva_venta: nuevaVenta }),
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al crear la venta:', error);
            });
    },

    cancelarVenta: (id_ventas) => {
        return fetch(`${api_url}/cancelar/${id_ventas}`, {
            method: 'PUT', 
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al cancelar la venta:', error);
            });
    },

    cambiarEstado: (id_ventas) => {
        return fetch(`${api_url}/estadoventa/${id_ventas}`, {
            method: 'PUT',
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al cambiar el estado de la venta:', error);
            });
    },
};

export default VentaService;


