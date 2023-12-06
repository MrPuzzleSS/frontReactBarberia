// authApi.js

import axios from 'axios';

const API_URL = 'http://localhost:8095/api/usuario'; // Reemplaza con la URL de tu servidor

const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    const token = response.data.token;
    return token;
  } catch (error) {
    throw error;
  }
};

export default { login };
