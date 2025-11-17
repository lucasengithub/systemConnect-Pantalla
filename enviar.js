var peer = new Peer({});

peer.on("error", (err) => {
  const message = err.message || err;
  const match = message.match(/peer (\w+)$/);
  const peerIDError = match ? match[1] : "desconocido";

  alert(`Imposible conectar con ${peerIDError}`);
  window.location.reload();
});

const tiempoEspera = 6000;

const idHold = document.getElementById("idHold");
const conectar = document.getElementById("conectar");
const form = document.querySelector("form");
const ventanaCojonera = document.getElementById("annWindow");
const megaWin = document.getElementById("mainCo");

peer.on("open", function (peerID) {
  console.log("PEER ID: " + peerID);
});

peer.on("error", function (err) {
  console.warn("Peer error:", err);
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
      audio: false,
      video: {
        width: { ideal: 1020 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 },
      },
    });
    var call = peer.call(peerID, mediaStream);

    fetch("/conectado.html")
      .then((res) => res.text())
      .then((html) => {
        html = html.replace(/\$\{peerID\}/g, peerID);
        megaWin.innerHTML = html;
      });
    megaWin.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    megaWin.style.color = "white";

    call.on("close", function () {
      clearTimeout(callTimeout);
      alert("Se ha perdido la conexión con la pantalla");
      window.location.reload();
    });

    call.on("error", function (err) {
      clearTimeout(callTimeout);
      console.warn("Error en la llamada:", err);
      alert("No se pudo conectar con el ID: " + peerID + ". Error: " + err);
      window.location.reload();
    });
  } catch (error) {
    alert("Error de conexión: " + error);
    return;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const bgImg = document.querySelector("body");

  function bgBImg() {
    if (!bgImg) return;
    const XImg = window.innerWidth;
    const YImg = window.innerHeight;
    bgImg.style.backgroundImage = `url('https://picsum.photos/${XImg}/${YImg}')`;
    bgImg.style.display = "Flex";
  }

  bgBImg();
});

function soloPerm(input) {
  const permitidos = /^[ABCDEFGHJKLMNPQRSTUVWXYZ1234567890]*$/i;

  input.value = input.value.toUpperCase();

  if (!permitidos.test(input.value)) {
    input.value = input.value.replace(
      /[^ABCDEFGHJKLMNPQRSTUVWXYZ1234567890]/gi,
      "",
    );
  }
  if (input.value.length > 6) {
    input.value = input.value.slice(0, 6);
  }
}

function adiosAnnWindow() {
  ventanaCojonera.style.opacity = "0";
  setTimeout(() => {
    ventanaCojonera.style.display = "none";
  }, "1000");
}
