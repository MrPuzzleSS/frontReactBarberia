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
  localStorage.setItem('token', token);
  localStorage.setItem('tokenExpiration', expirationDate);
  localStorage.setItem('userInfo', JSON.stringify(userInfo));

  console.log('Token del usuario:', token);
  window.location.href = '/dashboard'; // Reemplaza '/dashboard' con la ruta correcta de tu dashboard
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
