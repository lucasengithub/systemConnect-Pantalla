var peer = new Peer({});
console.log("v1.1");
const idHold = document.getElementById("idHold");
const conectar = document.getElementById("conectar");
const form = document.querySelector("form");

peer.on("open", function (peerID) {
  console.log("PEER ID: " + peerID);
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const peerID = idHold.value.trim();
  if (!peerID) {
    alert("Introduce un id");
    return;
  }
  console.log("Conectando con " + peerID);
  try {
    // Obtener stream de pantalla original (sin restricciones)
    var mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    // Extraer la pista de video del stream
    const videoTrack = mediaStream.getVideoTracks()[0];

    // Crear elemento video para reproducir el video capturado (sin mostrar en interfaz)
    const video = document.createElement("video");
    video.srcObject = new MediaStream([videoTrack]);
    await video.play();

    // Crear canvas con resolución inicial baja
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");

    // Función que dibuja cada frame en el canvas redimensionando el video
    function drawFrame() {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(drawFrame);
    }
    drawFrame();

    // Capturar stream del canvas con 15 FPS (priorizando rendimiento)
    const canvasStream = canvas.captureStream(15);

    // Realizar la llamada con PeerJS enviando el stream redimensionado
    var call = peer.call(peerID, canvasStream);

    call.on("close", function () {
      alert("Se ha perdido la conexión con la pantalla");
      window.location.reload();
    });
  } catch (error) {
    alert("Error de conexión: " + error);
    return;
  }
});
