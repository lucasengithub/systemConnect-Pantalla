var peer = new Peer({});
const emision = document.getElementById("emision");

var pbID = null;

const idNum = document.getElementById("idNum");

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
    console.log("Received", data);
  });
});

peer.on("call", function (call) {
  call.answer();
  call.on(
    "stream",
    function (remoteStream) {
      emision.srcObject = remoteStream;
      video.play();
    },
    function (err) {
      console.log("Failed to get local stream", err);
    },
  );
});
