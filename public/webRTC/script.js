let status = {
    id:'',
    uids: new Array(),
    screenStream: null,
    calls : {}
};
const socket = io("/");
const sendBtn = document.getElementById("chat_message_send");
const msgInput = document.getElementById("chat_message");
const messages = document.getElementById("main__chat_window");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const inviteButton = document.getElementById("inviteButton");
const stopVideo = document.getElementById("stopVideo");
const muteButton = document.getElementById("muteButton");
const shareScreen = document.getElementById("shareScreen");
myVideo.muted = true;
var peer = new Peer(undefined, {path: "/peerjs",host: "/"});
let myVideoStream;
navigator.mediaDevices.getUserMedia({audio: true,video: true,})
    .then((stream) => {
        stopVideo.classList.add('activeBtn');
        muteButton.classList.add('activeBtn');
        myVideoStream = stream;
        onClickFullScreen(myVideo)
        addVideoStream(myVideo, stream);
        peer.on("call", (call) => {
            call.answer(stream);
            const video = document.createElement("video");
            onClickFullScreen(video)
            call.on("stream", (userVideoStream) => {
                addVideoStream(video, userVideoStream);

                userVideoStream.getVideoTracks()[0].addEventListener('ended', () => {
                    video.remove();
                })
            });
            call.on("close", ()=> {
                video.remove();
            });
            call.on("error", ()=> {
                video.remove();
            });
            status.calls[call.connectionId] = call;
            if(!status.uids[call.peer])status.uids.push(call.peer);
        });
        socket.on("user-connected", (userId) => {
            if(status.uids.some( i => i==userId)){
                status.calls[userId] && status.calls[userId].close();
            }
            if(!status.uids[userId])status.uids.push(userId);
            connectToNewUser(userId, stream);
            if(status.screenStream)
                connectToNewUser(userId, status.screenStream);
            });
	socket.on("user-disconnected", (userId) => {
        if (peer.connections[userId] && peer.connections[userId].length){
            for( let c of peer.connections[userId]){
                c.close();
                if(status.calls.hasOwnProperty(c.connectionId)){
                    delete status.calls[c.connectionId];
                }
            }
        if(status.uids[userId]) status.uids = status.uids.filter(u => u!= userId);
        }
	    //peer.connections[userId] && peer.connections[userId][0] && peer.connections[userId][0].close();
	})
    });
    const connectToNewUser = (userId, stream) => {
        const call = peer.call(userId, stream);
        const video = document.createElement("video");
        onClickFullScreen(video)
        video.onended = function(e){
            video.remove();
        }
        call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
        });
        call.on("close", ()=> {
            video.remove();
        });
        call.on("error", ()=> {
            video.remove();
        });
	status.calls[call.connectionId] = call;
    };
    peer.on("open", (id) => {
        status.id = id;
        socket.emit("join-room", ROOM_ID, id);
    });
    const addVideoStream = (video, stream) => {
        video.srcObject = stream;
        video.addEventListener("loadedmetadata", () => {
            video.play();
            videoGrid.append(video);
        });
    };
    socket.on('msg',( msg)=>{
        let message = document.createElement('div');
        message.classList.add('message' ,'others_message');
        message.innerText = msg;
        messages.appendChild(message);
    })

    socket.on('close-call',( call)=>{
        if(status.calls.hasOwnProperty(call)){
            status.calls[call].close();
            delete status.calls[call];
        }
    })
        
sendBtn.addEventListener('click',handleMessage);
//msgInput.addEventListener('input',handleMessage);
function handleMessage (e){

    let msg = msgInput.value;
    if(msg === "")return;
    let message = document.createElement('div');
    message.classList.add('message', 'my_message');
    message.innerText = msg;
    messages.appendChild(message);
    msgInput.value = "";
    socket.emit("msg",msg)
}


inviteButton.addEventListener('click', () => {

    let text = "you are invited to join vedio chat. use this link \n"+document.location;
          
    if (navigator.share) {
        navigator.share({
          title: 'vedio chat',
          text: "you are invited to join vedio chat. use this link \n",
          url: window.location,
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      } else if (navigator.clipboard) {navigator.clipboard.writeText(text).then(function() {
              alert("Link copied to your clipboard: share with others to join this chat");
          }, function(err) {
            console.error('Async: Could not copy text: ', err);
          });
      }
});

muteButton.addEventListener('click',(e)=>{
    myVideoStream.getAudioTracks()[0].enabled = !myVideoStream.getAudioTracks()[0].enabled;
    muteButton.classList.toggle('activeBtn');
})
stopVideo.addEventListener('click',(e)=>{
    myVideoStream.getVideoTracks()[0].enabled = !myVideoStream.getVideoTracks()[0].enabled;
    stopVideo.classList.toggle('activeBtn');
})
shareScreen.addEventListener('click',async (e)=>{
    screen_calls = [];
     status.screenStream = await navigator.mediaDevices.getDisplayMedia()
     for (let u of status.uids) {
        let call = peer.call(u,status.screenStream) ;
        screen_calls.push(call);
     }  
     const video = document.createElement('video');
        onClickFullScreen(video)
        addVideoStream(video, status.screenStream);
        shareScreen.classList.add('activeBtn');
        status.screenStream.getVideoTracks()[0].addEventListener('ended', () => {
            shareScreen.classList.remove('activeBtn');
            status.screenStream.getTracks().forEach(track => track.stop());
            video.remove();
            for (let c of screen_calls){
                console.log("closing",c)
                c.close();  
                socket.emit("close-call",c.connectionId);
            }
        })
})

const onClickFullScreen = (video)=>{
    video.classList.add('video-grid-video');
    video.onclick = function(e){
        video.classList.toggle('fullscreen')
        videoGrid.classList.toggle('fullscreen-grid')
    }
}

window.onbeforeunload = function(){
    status.calls.forEach(c => c.close())
    socket.emit('disconnect')
    return 'Are you sure you want to leave?';
  };