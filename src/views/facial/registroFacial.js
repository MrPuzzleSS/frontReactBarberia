import React, { useRef, useState } from "react";

const RegistroFacial = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturing, setCapturing] = useState(false);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((error) => {
        console.log("Error al acceder a la cámara:", error);
      });
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });

    videoRef.current.srcObject = null;
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const image = canvas.toDataURL("image/jpeg");

    // Aquí puedes enviar la imagen a tu backend para procesarla

    setCapturing(false);
  };

  return (
    <div>
      <video ref={videoRef} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      
      {!capturing ? (
        <button onClick={() => setCapturing(true)}>Capturar imagen</button>
      ) : (
        <button onClick={captureImage}>Guardar imagen</button>
      )}
      
      {!capturing && (
        <button onClick={startCamera}>Iniciar cámara</button>
      )}
      
      {capturing && (
        <button onClick={stopCamera}>Detener cámara</button>
      )}
    </div>
  );
};

export default RegistroFacial;