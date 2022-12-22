const fs = require('fs');
const router = require('express').Router();
const urlModule = require('url');
const http = require('http');
const https = require('https');
const ytdl = require('ytdl-core');

const download = async (req,res)=>{
    try{
     const url = urlModule.parse(req.body.message.text);
     let protocol;
     if(!url.hostname || url.hostname == '127.0.0.1'){
        res.json({
            'method':'sendMessage',
            'chat_id':req.body.message.chat.id,
            'text':'error downloading: not url',
        });
        return;
     }
     if(url.protocol == 'https:'){
         protocol = https
     } else {
         protocol = http
     }
     let fn = url.pathname;
        fn = fn.indexOf('/')>=0?fn.substring(fn.lastIndexOf('/')+1):fn;
    await protocol.get(url, async(response)=>{
        
        if(response.headers.location){
            req.body.message.text = response.headers.location;
            download(req,res);
            return;
        }
        
        let resfl = response.headers['content-disposition'];
        if(resfl && resfl.indexOf('filename=') >= 0){
          
        resfl = resfl.substring(resfl.indexOf('filename=')+9);
        resfl.substring(0,resfl.indexOf(';'));
//                resfl = resfl.replace(/\//gi,'').replace(/\\/gi,'').replace(/\'/gi,'').replace(/\"/gi,'');
     
        if(resfl){
            fn = resfl;
        }  
        }
        
     const fl = __dirname+'/../public/downloads/'+fn;
    await fs.writeFile(fl,'',er => console.log(er));
     const file = await fs.createWriteStream(fl);
        response.pipe(file,err=>console.log('pipe'+err));
        
        res.json({
            'method':'sendDocument',
            'chat_id':req.body.message.chat.id,
            'document':process.env.Host+encodeURI('/downloads/'+fn)
        });
    
    })
    .on('error',() =>{
        res.json({
            'method':'sendMessage',
            'chat_id':req.body.message.chat.id,
            'text':'error downloading'+err.message,
        });
        return;
    });;
}catch(err){
console.log(err);
res.json({
    'method':'sendMessage',
    'chat_id':req.body.message.chat.id,
    'text':'error downloading'+err,
});
}
}


router.post('/update',async (req,res)=>{
   // await download(req,res);
    try{
        let info = await ytdl.getInfo(req.body.message.text);
        let infoformats = [...info.formats,...info.player_response.streamingData.formats];
        if(!info.videoDetails.videoId){
            res.json({
                'method':'sendMessage',
                'chat_id':req.body.message.chat.id,
                'text':'not youtube url',
            });
        }
        const i = infoformats.find(e => e.itag == 18);
        res.json({
            'method':'sendVideo',
            'chat_id':req.body.message.chat.id,
            'video':( i.url)+`&redirect_counter=1&cms_redirect=yes&name=${encodeURI(info.videoDetails.title)}.${i.container}`,
        })
        }catch(err){
            console.log(req.body,err);
            res.json({
                'method':'sendMessage',
                'chat_id':req.body.message.chat.id,
                'text':'error downloading'+err,
            });
        }
        
});

module.exports = router;