// auth.js
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('tokenExpiration');
  
    if (!token || !expirationDate) {
      return false;
    }
  
    // Verificar si el token ha expirado
    return new Date(expirationDate) > new Date();
  };
  
  export const setSession = (token, expirationDate) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiration', expirationDate);
  };
  
  export const removeSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
  };
  