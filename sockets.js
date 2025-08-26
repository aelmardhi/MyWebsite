const { Server } = require("socket.io");

const addSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // ⚠️ replace "*" with your frontend URL in production
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("join-room", (roomId, userId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-connected", userId);

      socket.on("disconnect", () => {
        socket.to(roomId).emit("user-disconnected", userId);
      });
    });

    socket.on("msg", (msg) => {
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.to(room).emit("msg", msg);
        }
      });
    });

    socket.on("close-call", (msg) => {
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.to(room).emit("close-call", msg);
        }
      });
    });
  });
  
  io.on('log',(id, msg)=>{
    io.broadcast(msg);
  })

  return io;
};

module.exports = addSocket;
