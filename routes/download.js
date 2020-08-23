const fs = require('fs');
const router = require('express').Router();
const urlModule = require('url');
const http = require('http');
const https = require('https');

const download = async (req,res)=>{
            try{
             const url = urlModule.parse(req.body.url);
             let protocol;
             if(url.protocol == 'https:'){
                 protocol = https
             } else {
                 protocol = http
             }
             let fn = url.pathname.replace(/\//gi,' ');
            await protocol.get(url, async(response)=>{
                if(response.headers.location){
                    req.body.url = response.headers.location;
                    download(req,res);
                    return;
                }
                
                let resfl = response.headers['content-disposition'];
                if(resfl && resfl.indexOf('filename=') >= 0){
                  
                resfl = resfl.substring(resfl.indexOf('filename=')+9);
                resfl.substring(0,resfl.indexOf(';'));
             
                if(resfl){
                    fn = resfl;
                }  
                }
                
             const fl = __dirname+'/../public/downloads/'+fn;
            await fs.writeFile(fl,'',er => console.log(er));
             const file = await fs.createWriteStream(fl);
                response.pipe(file,err=>console.log('pipe'+err));
                
            res.send('downloads/'+fn);
            });
}catch(err){
    console.log(err);
    res.status(400).send('error downloading'+err);
}
}

router.post('/', async (req,res)=>{
    await download(req,res);
         });


router.get('/files' ,async (req , res) => {
    let data = [];
    const dir = await fs.promises.opendir(__dirname+'/../public/downloads');
    for await (const dirent of dir) {
        await fs.stat(__dirname+'/../public/downloads/'+dirent['name'],(err,stats) => {
            data.push( {"name":dirent.name,
                       "size":stats.size,
                       "modified":new Date(stats.mtimeMs).toDateString(),
                      });
        })
        
  }
  res.json(data);
});

module.exports = router;