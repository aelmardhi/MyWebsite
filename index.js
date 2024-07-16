
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const { ExpressPeerServer } = require("peer");


const {deleteOld} = require('./models/subscribtion');
const app = require('./app.js');
const addSockets = require('./sockets.js');

dotenv.config();

var server;
if (process.env.USE_LOCALHOST_HTTPS == 'true'){
  const key = fs.readFileSync('./localhost/localhost.decrypted.key');
  const cert = fs.readFileSync('./localhost/localhost.crt');
  server = require("https").Server({ key, cert },app);
} else {
  
  server = require("http").Server(app);
}


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

addSockets(server);

const peerServer = ExpressPeerServer(server, {debug: true,});
app.use("/peerjs", peerServer);

const portNumber = (process.env.PORT || 5000);

server.listen(portNumber, () => console.log('server started on port'+portNumber));