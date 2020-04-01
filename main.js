const socket = io("http://localhost:3000");
$('#div_chat').hide()
socket.on('Danhsach', arrUser=>{
  $('#div_chat').show()
  $('#div_dangky').hide()
    arrUser.forEach(user => {
      const {ten, peerId} = user
      $('#ulUser').append(`<li id="${peerId}">${ten}</li>`)
    });
    socket.on('NewUser', user=>{
      const {ten, peerId} = user
      $('#ulUser').append(`<li id="${peerId}">${ten}</li>`)
    })
    socket.on('NgatKetNoi', peerId=>{
      $(`#${peerId}`).remove()
    })
})
socket.on('DangKyFail', ()=> alert('Chon ten khac de dang ky'))
function OpenSteam() {
  const config = { audio: false, video: true };
  return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag, stream) {
  const video = document.getElementById(idVideoTag);
  video.srcObject = stream;
  video.play();
}
// OpenSteam()
//  .then(stream=>playStream('localStream', stream) )
const peer = new Peer();
peer.on("open", id => {
  $("#my-peer").append(id);
  $("#btnSignUp").click(() => {
    const user = $("#username").val();
    socket.emit("UserName", {ten: user, peerId: id});
  });
});
//Caller
$("#btnCall").click(() => {
  const id = $("#remoteID").val();
  OpenSteam().then(stream => {
    playStream("localStream", stream);
    const call = peer.call(id, stream);
    call.on("stream", remoteStream => playStream("remoteStream", remoteStream));
  });
});
// nguoi nhan
peer.on("call", call => {
  OpenSteam().then(stream => {
    call.answer(stream);
    playStream("localStream", stream);
    call.on("stream", remoteStream => playStream("remoteStream", remoteStream));
  });
});
$('#ulUser').on('click', 'li', function(){
  const id = $(this).attr('id')
  OpenSteam().then(stream => {
    playStream("localStream", stream);
    const call = peer.call(id, stream);
    call.on("stream", remoteStream => playStream("remoteStream", remoteStream));
  });
})

