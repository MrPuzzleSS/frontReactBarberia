// auth.js

export const getToken = () => {
  return localStorage.getItem('token') || '';
};

export const isAuthenticated = () => {
  try {
    const token = getToken();
    const expirationDate = localStorage.getItem('tokenExpiration');

    if (!token || !expirationDate) {
      return false;
    }

    const currentDateTime = new Date();
    const tokenExpirationDateTime = new Date(expirationDate);

    if (currentDateTime < tokenExpirationDateTime) {
      return true;
    } else {
      // Si el token ha expirado, eliminar el token y redirigir al usuario al login
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      return false;
    }
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
    return false;
  }
};

export const setSession = (token, expirationDate, userInfo) => {
  const userInfoWithId = {
    ...userInfo,
    id_usuario: userInfo.userId, // Asegúrate de que el nombre de la clave coincida con la que usas para obtener el ID en otros lugares
  };

  localStorage.setItem('token', token);
  localStorage.setItem('tokenExpiration', expirationDate);
  localStorage.setItem('userInfo', JSON.stringify(userInfoWithId));

  console.log('Token del usuario:', token);

  if (userInfo.rol.nombre === 'Cliente') {
    window.location.href = '/cliente'; // Redirigir al usuario con rol de cliente
  } else if (userInfo.rol.nombre === 'Empleado') {
    window.location.href = '/listaCitas'; // Redirigir al usuario con rol de empleado
  } else {
    window.location.href = '/dashboard'; // Redirigir a la ruta de dashboard para otros roles
  }
};



export const removeSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiration');
  localStorage.removeItem('userInfo'); // Ajusta el nombre aquí también
};

export const getUserInfo = () => {
  const userInfoString = localStorage.getItem('userInfo');
  return userInfoString ? JSON.parse(userInfoString) : null;
};

export const logout = () => {
  removeSession();
  // Puedes agregar lógica adicional aquí, como redirigir a la página de inicio de sesión, etc.
  // window.location.href = '/login';
};
