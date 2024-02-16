/*
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'https://resapibarberia.onrender.com/api';

// Interceptor para las solicitudes
axios.interceptors.request.use(
  function (config) {
    console.log('Antes de agregar el token - Encabezados:', config.headers);

    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('Después de agregar el token - Encabezados:', config.headers);
    return config;
  },
  function (error) {
    console.error('Error en la solicitud:', error);
    return Promise.reject(error);
  }
);

// Interceptor para las respuestas
axios.interceptors.response.use(
  function (response) {
    console.log('Respuesta recibida:', response);
    return response;
  },
  function (error) {
    console.error('Error en la respuesta:', error);

    // Verificar si el error indica falta de autenticación (código 401)
    if (error.response && error.response.status === 401) {
      console.log('Usuario no autenticado. Redirigiendo al login.');

      // Obtener la función de navegación de React Router
      const navigate = useNavigate();

      // Realizar la redirección al login
      navigate('/login');
    }

    return Promise.reject(error);
  }
);

export default axios;
*/