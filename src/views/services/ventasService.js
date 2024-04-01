const api_url = 'http://localhost:8095/api/venta';

const VentaService = {

    getVentas: () => {
        const token = localStorage.getItem('token');
        return fetch(`${api_url}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
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
        const token = localStorage.getItem('token');
        return fetch(`${api_url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nueva_venta: nuevaVenta }),
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al crear la venta:', error);
            });
    },

    cargarVenta: (cargarventa) => {
        const token = localStorage.getItem('token');
        return fetch(`${api_url}s`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nueva_cargarventa: cargarventa }),
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al crear la venta:', error);
            });
    },

    cancelarVenta: (id_ventas) => {
        const token = localStorage.getItem('token');
        return fetch(`${api_url}/cancelar/${id_ventas}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al cancelar la venta:', error);
            });
    },

    cambiarEstado: (id_ventas) => {
        const token = localStorage.getItem('token');
        return fetch(`${api_url}/estadoventa/${id_ventas}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error al cambiar el estado de la venta:', error);
            });
    },
    
    
    getVentaById: (id) => {
        const token = localStorage.getItem('token');
        return fetch(`${api_url}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener la venta: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error(`Error al obtener la venta con ID ${id}:`, error.message);
        });
    },
    
};


export default VentaService;
