var peer = new Peer({});

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
    var mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });
    var call = peer.call(peerID, mediaStream);

    call.on("close", function () {
      alert("Se ha perdido la conexión con la pantalla");
      window.location.reload();
    });
  } catch (error) {
    alert("Error de conexión: " + error);
    return;
  }
});
