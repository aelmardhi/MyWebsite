const express = require('express');
const helmet = require('helmet');
const app = express();

const authRoute = require('./routes/auth');
const messageRoute = require('./routes/messages');
const ytdlRoute = require('./routes/ytdl');
const uploadRoute = require('./routes/upload');
const downloadRoute = require('./routes/download');
const telegramRoute = require('./routes/telegram');
const rtcRoute = require('./routes/rtc');
const webPushRoute = require('./routes/webPush')
const blogRoute = require('./routes/blog')
const ImagesRoute = require('./routes/images')

app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
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
app.use('/api/images',ImagesRoute);
if(process.env.SCRAPE !== 'false')
  app.use('/api/scrape',require('./routes/scrape'));



module.exports = app;
