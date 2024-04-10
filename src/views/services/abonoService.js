const api_url = 'http://localhost:8095/api';

const AbonoService = {

  getAbonos: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${api_url}/abonos`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.abonos;
    } catch (error) {
      console.error('Error al obtener los abonos:', error);
      throw error;
    }
  },


  getAbono: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${api_url}/abono/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const abono = await response.json();
      return abono;
    } catch (error) {
      console.error(`Error al obtener el abono con ID ${id}:`, error);
      throw error;
    }
  },


  postAbonos: async (id, idCliente, montoAbono) => {
    const abono = {
      id_ventas: id,
      id_cliente: idCliente,
      monto_abono: montoAbono,
    };
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${api_url}/abono`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(abono)
      });
      const data = await response.json();
      return data.abono;
    } catch (error) {
      console.error('Error al crear el abono:', error);
      throw error;
    }
  }


};

export default AbonoService;
