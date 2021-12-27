const express = require('express');
const fs = require('fs');
const urlModule = require('url');
const app = express();

const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');

var html404;
try{
html404 = fs.readFileSync('404.html').toString();
} catch(e){
html404 = '404: not found';
}
const { ExpressPeerServer } = require("peer");

const authRoute = require('./routes/auth');
const messageRoute = require('./routes/messages');
const ytdlRoute = require('./routes/ytdl');
const uploadRoute = require('./routes/upload');
const downloadRoute = require('./routes/download');
const telegramRoute = require('./routes/telegram');
const rtcRoute = require('./routes/rtc');
const webPushRoute = require('./routes/webPush')

const {deleteOld} = require('./models/subscribtion')



const cloudinary = require('cloudinary');

var server;
if (process.env.USE_LOCALHOST_HTTPS == 'true'){
  const key = fs.readFileSync('./localhost/localhost.decrypted.key');
  const cert = fs.readFileSync('./localhost/localhost.crt');
  server = require("https").Server({ key, cert },app);
} else {
  
  server = require("http").Server(app);
}

const io = require("socket.io")(server);
const peerServer = ExpressPeerServer(server, {debug: true,});

mongoose.connect(process.env.DB_CONNECT,
                 {useNewUrlParser: true, useUnifiedTopology: true },
                 (err) =>{
    if(err)console.log(err);
    else {
      console.log('connected to db');
      deleteOld()
    }
});

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});


app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));
app.use('/test',express.static('testing site'));
//app.use('/uploads/profile_images',express.static('uploads/profile_images'));
//app.get('/',(res,req)=>{
//    res.send('hello');
//})
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header(
    "Access-Control-Allow-Headers","Origin, X-requested-With, Content-Type, auth-token"
    );
    next();    
});

app.use('/',webPushRoute);
app.use('/api/user', authRoute);
app.use('/api/messages', messageRoute);
app.use('/api/ytdl', ytdlRoute);
app.use('/api/download', downloadRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/telegram/'+process.env.TELEGRAM_TOKEN,telegramRoute);
app.use('/api/rtc',rtcRoute);
app.use("/peerjs", peerServer);
// if no page match
app.get('*', (req,res) => {
  res.status(404).header({
    accept: 'text/html',
  }).send(html404?html404:'404:not Found');
})

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
})
const portNumber = (process.env.PORT || 5000);



server.listen(portNumber, () => console.log('server started on port'+portNumber));