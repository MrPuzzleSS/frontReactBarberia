import { io } from 'socket.io-client';

const socket = io('http://localhost:8095', {
    withCredentials: true,
});


socket.on("connect", () => {
    console.log("Conexión establecida con el servidor");
    socket.emit("clienteConectado", { message: "Cliente conectado correctamente" });
  });
  
export default socket;
