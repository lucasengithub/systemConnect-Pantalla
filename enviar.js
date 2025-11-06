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
      audio: true,
    });
    var call = peer.call(peerID, mediaStream);
  } catch (error) {
    alert("Error de conexión: " + error);
    return;
  } finally {
    call.on("stream", function (remoteStream) {
      var video = document.createElement("video");
      video.srcObject = remoteStream;
      video.play();
      document.body.appendChild(video);
    });
  }
});
