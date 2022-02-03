const fs = require('fs');
const ytdl = require('ytdl-core');
const router = require('express').Router();




router.post('/info', async (req,res)=> {
    console.log(req.ip);
    if(!(req && req.body && req.body.id)){
        res.status(400).send('request should have body with id');
    }
    let info = await ytdl.getInfo(req.body.id);
    let basicInfo = await ytdl.getBasicInfo(req.body.id);
    let basicInfoformats = [...basicInfo.formats,...basicInfo.player_response.streamingData.formats];

    let retInfo = {
        'id': info.videoDetails.videoId,
        'title': info.videoDetails.title,
        'author': info.videoDetails.author.name,
        'thumbnail': info.videoDetails.thumbnail.thumbnails[1].url,
        'formats': [...info.formats,...info.player_response.streamingData.formats].map( i => ({
            "itag" : i.itag,
            "container": i.container,
            "quality": i.quality,
            "resolution": i.qualityLabel,
//            "resolution": i.resolution,
            "encoding": (i.hasVideo?'v':'')+(i.hasAudio?'a':''),
//            "encoding": i.encoding,
            "url": (basicInfoformats.find(e => e.itag === i.itag)).url,
            // "url": i.url.replace(/ip=\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/,'ip='+req.ip),
        }))
    }
    res.status(200).json(retInfo);
});

router.post('/download', async(req, res) => {
    try{
    const fn =  req.body.title + '.'+req.body.container;
//        const fn = (req.body.title.replace(/\//gi,'').replace(/\\/gi,'').replace(/\'/gi,'').replace(/\"/gi,'')) + '.'+req.body.container;
    const fl = __dirname+'/../public/downloads/'+fn;
    await fs.writeFile(fl,'',er => console.log(er));
    ytdl(req.body.id,{"quality": req.body.itag})
  .pipe(fs.createWriteStream(fl));
    res.json({'url':encodeURI('downloads/'+fn)});
    }catch(err){
        console.log(req.body,err);
        res.status(401).send(err);
    }
    
});

module.exports = router;
