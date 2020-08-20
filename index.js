const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const urlModule = require('url');
const app = express();

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const authRoute = require('./routes/auth');
const messageRoute = require('./routes/messages');
const ytdlRoute = require('./routes/ytdl');

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

app.post('/api/download', async (req,res)=>{
         try{
             const url = urlModule.parse(req.body.url);
             let protocol;
             if(url.protocol == 'https:'){
                 protocol = https
             } else {
                 protocol = http
             }
             const fn = url.pathname;
             const fl = __dirname+'/public/downloads'+fn;
            await fs.writeFile(fl,'',er => console.log(er));
             const file = fs.createWriteStream(fl);
            await protocol.get(url,(response)=>{
                response.pipe(file,err=>console.log('pipe'+err));
            });
            res.send('downloads'+fn);
}catch(err){
    console.log(err);
    res.status(400).send('error downloading'+err);
}
         });
app.get('/api/download/files' ,async (req , res) => {
    let data = [];
    const dir = await fs.promises.opendir(__dirname+'/public/downloads');
    for await (const dirent of dir) {
        await fs.stat(__dirname+'/public/downloads/'+dirent['name'],(err,stats) => {
            data.push( {"name":dirent.name,
                       "size":stats.size,
                       "modified":new Date(stats.mtimeMs).toDateString(),
                      });
        })
        
  }
  res.json(data);
});

app.listen((process.env.PORT || 5000), () => console.log('server started'));