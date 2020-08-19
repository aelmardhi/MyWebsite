const fs = require('fs');
const ytdl = require('ytdl-core');
const router = require('express').Router();
// TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
// TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
// TypeScript: import ytdl = require('ytdl-core'); with neither of the above



router.post('/info', async (req,res)=> {
    if(!(req && req.body && req.body.id)){
        res.status(400).send('request should have body with id');
    }
    let info = await ytdl.getInfo(req.body.id);
    let retInfo = {
        'id': info.videoDetails.videoId,
        'title': info.videoDetails.title,
        'author': info.videoDetails.author.name,
        'formats': info.formats.map( i => ({
            "itag" : i.itag,
            "container": i.container,
            "quality": i.quality,
            "resolution": i.resolution,
            "encoding": i.encoding,
        }))
    }
    res.status(200).json(retInfo);
});

router.post('downlpad', async(req, res) => {
    const fn = req.body.title + '.'+req.body.container;
    const fl = __dirname+'/public/downloads/'+fn;
    ytdl(req.body.id,{"quality": req.body.itag})
  .pipe(fs.createWriteStream(fl));
    res.send('downloads/'+fn);
});

module.exports = router;
