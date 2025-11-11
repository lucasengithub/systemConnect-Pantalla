var peer = new Peer({});
console.log("v1.1a");

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
    // Captura directa de pantalla (getDisplayMedia)
    var mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    // Obtener track de video original
    const videoTrack = mediaStream.getVideoTracks()[0];

    // Aplicar restricciones iniciales bajas para priorizar rendimiento
    await videoTrack.applyConstraints({
      width: 640,
      height: 360,
      frameRate: 15,
    });

    // Crear nuevo MediaStream solo con el track modificado
    const limitedStream = new MediaStream([videoTrack]);

    // Iniciar la llamada enviando el stream con baja resolución
    var call = peer.call(peerID, limitedStream);

    // Después de 10 segundos, eliminar las restricciones para que la calidad aumente adaptativamente
    setTimeout(() => {
      videoTrack
        .applyConstraints({
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        })
        .catch((e) => console.warn("No se pudo aumentar la resolución:", e));
    }, 10000);

    call.on("close", function () {
      alert("Se ha perdido la conexión con la pantalla");
      window.location.reload();
    });
  } catch (error) {
    alert("Error de conexión: " + error);
    return;
  }
});
