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
            'document':'https://dardasha.herokuapp.com/'+encodeURI('downloads/'+fn)
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
        const fn =  'aelm'+ '.'+'mp4';
    //        const fn = (req.body.title.replace(/\//gi,'').replace(/\\/gi,'').replace(/\'/gi,'').replace(/\"/gi,'')) + '.'+req.body.container;
        const fl = __dirname+'/../public/downloads/'+fn;
        await fs.writeFile(fl,'',er => console.log(er));
        ytdl(req.body.message.text,{"quality": 18})
      .pipe(fs.createWriteStream(fl));
        res.json({
            'method':'sendVideo',
            'chat_id':req.body.message.chat.id,
            'video':'https://dardasha.herokuapp.com/'+encodeURI('downloads/'+fn)
        });
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