const SocketIo = require("socket.io");

const addSocket = (server) => {
const io = SocketIo(server);

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    socket.on("disconnect",()=>{
	socket.to(roomId).emit("user-disconnected", userId);
    })	
  });
  socket.on('msg',(msg)=>{

    socket.rooms.forEach(r => socket.to(r).emit('msg',msg));
  })
  socket.on('close-call',(msg)=>{

    socket.rooms.forEach(r => socket.to(r).emit('close-call',msg));
  })
});
io.on('log',(id, msg)=>{
  io.broadcast(msg);
})io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    socket.on("disconnect",()=>{
	socket.to(roomId).emit("user-disconnected", userId);
    })	
  });
  socket.on('msg',(msg)=>{

    socket.rooms.forEach(r => socket.to(r).emit('msg',msg));
  })
  socket.on('close-call',(msg)=>{

    socket.rooms.forEach(r => socket.to(r).emit('close-call',msg));
  })
});
io.on('log',(id, msg)=>{
  io.broadcast(msg);
});
};

module.exports = addSocket;