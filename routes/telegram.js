const fs = require('fs');
const router = require('express').Router();
const urlModule = require('url');
const http = require('http');
const https = require('https');

const download = async (req,res)=>{
    try{
     const url = urlModule.parse(req.body.message.text);
     let protocol;
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
            'text':'https://dardasha.herokuapp.com/'+encodeURI('downloads/'+fn)
        });
    
    });
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
    await download(req,res);
  /*  const url = urlModule.parse(req.body.message.text);
    if(!url.pathname){
        res.send('ok');
        return;
    }
    http.request({'path':'http://dardasha.herokuapp.com/api/download/','body':{'url':req.body.message.text}});
    res.json({
        'method':'sendMessage',
        'chat_id':req.body.message.chat.id,
        'text':req.body.message.text,
    })
    */
});

module.exports = router;