const api_url = 'http://localhost:8095/api/venta';

const VentaService = {
    getVentas: () => {
        return fetch(`${api_url}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Error al obtener las ventas:', error);
            });
    },

    getVentaById: (id) => {
        return fetch(`${api_url}/venta/${id}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Error al obtener la venta por ID:', error);
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

    anularVenta: (id) => {
        return fetch(`${api_url}/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al anular la venta:', error);
            });
    },
};

export default VentaService;


