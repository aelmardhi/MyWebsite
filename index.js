const express = require('express');
const fs = require('fs');
const urlModule = require('url');
const app = express();

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const authRoute = require('./routes/auth');
const messageRoute = require('./routes/messages');
const ytdlRoute = require('./routes/ytdl');
const uploadRoute = require('./routes/upload');
const downloadRoute = require('./routes/download');



const cloudinary = require('cloudinary');

dotenv.config();


mongoose.connect(process.env.DB_CONNECT,
                 {useNewUrlParser: true, useUnifiedTopology: true },
                 (err) =>{
    if(err)console.log(err);
    else console.log('connected to db');
});

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
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
app.use('/api/user', authRoute);
app.use('/api/messages', messageRoute);
app.use('/api/ytdl', ytdlRoute);
app.use('/api/download', downloadRoute);
app.use('/api/upload', uploadRoute);



const portNumber = (process.env.PORT || 5000);
app.listen(portNumber, () => console.log('server started'));