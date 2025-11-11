function genPin() {
  const dentro = "ABCDEFGHJKLMNPQRSTUVWXYZ1234567890";
  var res = "";
  for (var i = 0; i < 6; i++) {
    var tmpIPin = Math.floor(Math.random() * dentro.length);
    res = res + dentro.charAt(tmpIPin);
  }
  return res;
}

function urlHost() {
  var fullUrl = window.location.host + "/enviar";
  urlPl.innerHTML = fullUrl;
  return;
}

const pinID = genPin();
var peer = new Peer(pinID);
const emision = document.getElementById("emision");
const pantallaInfo = document.getElementById("pantallaInfo");
const urlPl = document.getElementById("urlPl");
const YImg = window.screen.availHeight;
const XImg = window.screen.availWidth;
const bgImg = document.getElementById("videoContainer");

var pbID = null;

const idNum = document.getElementById("idNum");
urlHost();

function bgBImg() {
  bgImg.style.backgroundImage = `url('https://picsum.photos/${XImg}/${YImg}')`;
  bgImg.style.display = "flex";
}

bgBImg();

peer.on("open", function (peerID) {
  console.log("PEER ID: " + peerID);
  idNum.innerHTML = peerID;
  pbID = peerID;
});

function copyNum() {
  navigator.clipboard.writeText(pbID);
  return;
}

peer.on("connection", function (conn) {
  conn.on("data", function (data) {
    console.log(data);
  });
});

peer.on("call", function (call) {
  pantallaInfo.style.display = "none";
  bgImg.style.backgroundImage = "none";
  emision.style.display = "block";
  call.answer();
  call.on(
    "stream",
    function (remoteStream) {
      emision.srcObject = remoteStream;
      emision.play();
      emision.muted = true;
    },
    function (err) {
      console.log("Failed to get local stream", err);
    },
  );

  call.on("close", function () {
    console.log("Desconectado");
    pantallaInfo.style.display = "flex";
    emision.style.display = "none";
    bgBImg();
    emision.srcObject = null;
  });

  call.on("error", function (err) {
    console.log("Error: ", err);
    pantallaInfo.style.display = "flex";
    emision.style.display = "none";
    bgBImg();
    emision.srcObject = null;
  });
});

function fullYAudio() {
  emision.muted = false;
  emision.play();
  /* if (!document.fullscreenElement) {
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
    }*/
}
