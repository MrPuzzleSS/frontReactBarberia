import React, { useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ path, element }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        const response = await fetch('https://resapibarberia.onrender.com/api/verificar-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error al verificar el token:', error);
        setAuthenticated(false);
        setLoading(false);
      }
    };

    verificarToken();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return authenticated ? <Route path={path} element={element} /> : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  path: PropTypes.string.isRequired,
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;
