const express = require('express');
const helmet = require('helmet');
const fs = require('fs');
const urlModule = require('url');
const app = express();

var html404;
try{
html404 = fs.readFileSync('404.html').toString();
} catch(e){
html404 = '404: not found';
}
const authRoute = require('./routes/auth');
const messageRoute = require('./routes/messages');
const ytdlRoute = require('./routes/ytdl');
const uploadRoute = require('./routes/upload');
const downloadRoute = require('./routes/download');
const telegramRoute = require('./routes/telegram');
const rtcRoute = require('./routes/rtc');
const webPushRoute = require('./routes/webPush')
const blogRoute = require('./routes/blog')
const uploadImageRoute = require('./routes/uploadImage')
const scrapeRoute = require('./routes/scrape')

app.disable('x-powered-by');
app.use(helmet());
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

app.use('/blog/',(req,res)=>{
  res.sendFile(__dirname+'/public/blog/index.html')
})

app.use('/',webPushRoute);
app.use('/api/user', authRoute);
app.use('/api/messages', messageRoute);
app.use('/api/ytdl', ytdlRoute);
app.use('/api/download', downloadRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/telegram/',telegramRoute);
app.use('/api/rtc',rtcRoute);
app.use('/api/blog',blogRoute);
app.use('/api/uploadImage',uploadImageRoute);
app.use('/api/scrape',scrapeRoute);

// if no page match
app.use((req,res) => {
  res.status(404).header({
    accept: 'text/html',
  }).send(html404?html404:'404:not Found');
});

app.use((err, req, res, next) => {
  console.error(`${err.name} : ${err.message} --- ${err.stack}`)
  res.status(500).send('Something broke!')
});

module.exports = app;
