import axios from "axios";


const instance = axios.create({
    baseURL: "https://restapibarberia.onrender.com/api/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Obtener el token del localStorage
const token = localStorage.getItem("token");

// Verificar si hay un token y establecerlo en el encabezado de autorización si está presente
if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default instance;


