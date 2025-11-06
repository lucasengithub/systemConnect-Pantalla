var peer = new Peer({});
const emision = document.getElementById("emision");
const pantallaInfo = document.getElementById("pantallaInfo");
const urlPl = document.getElementById("urlPl");

function urlHost() {
  var fullUrl = window.location.host + "/enviar";
  urlPl.innerHTML = fullUrl;
  return;
}

var pbID = null;

const idNum = document.getElementById("idNum");
urlHost();

peer.on("open", function (peerID) {
  console.log("PEER ID: " + peerID);
  idNum.innerHTML = peerID;
  pbID = peerID;
});

function copyNum() {
  navigator.clipboard.writeText(pbID);
  return;
}

function perspectivaIn(scaleValue) {
  emision.style.transform = `scale(${scaleValue})`;
}

peer.on("connection", function (conn) {
  conn.on("data", function (data) {
    console.log(data);
  });
});

peer.on("call", function (call) {
  pantallaInfo.style.display = "none";
  emision.style.animation = "brillo 0.6s infinite";
  perspectivaIn(0.6);
  call.answer();
  call.on(
    "stream",
    function (remoteStream) {
      emision.srcObject = remoteStream;
      setTimeout(() => {
        emision.style.animation = "none";
        perspectivaIn(1);
      }, 2500);
    },
    function (err) {
      console.log("Failed to get local stream", err);
    },
  );
});

function fullYAudio() {
  emision.muted = false;
  emision.play();
  if (!document.fullscreenElement) {
    if (emision.requestFullscreen) {
      emision.requestFullscreen();
    } else if (emision.webkitRequestFullscreen) {
      // Safari
      emision.webkitRequestFullscreen();
    } else if (emision.msRequestFullscreen) {
      // IE11
      emision.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      // Safari
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE11
      document.msExitFullscreen();
    }
  }
}
