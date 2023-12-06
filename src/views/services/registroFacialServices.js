const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
  
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    const image = canvas.toDataURL("image/jpeg");
  
    // Envío de la imagen a la API
    fetch('http://localhost:8095/api/registroFacial', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Puedes agregar otros encabezados si son necesarios
      },
      body: JSON.stringify({ image: image }), // Enviar la imagen como JSON o en el formato necesario por tu API
    })
    .then(response => {
      // Manejar la respuesta de la API aquí
      console.log('Respuesta de la API:', response);
      // Puedes realizar acciones adicionales según la respuesta de la API
    })
    .catch(error => {
      // Manejar errores en la solicitud fetch
      console.error('Error al enviar la imagen:', error);
    });
  
    setCapturing(false);
  };
  