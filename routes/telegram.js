const { urlencoded } = require('body-parser');

const router = require('express').Router();
const urlModule = require('url');
const https = require('https');


router.post('/update',async (req,res)=>{
    const url = urlModule.parse(req.body.message.text);
    if(!url.pathname){
        res.send('ok');
        return;
    }
    https.request({'path':'../../download/','body':{'url':req.body.message.text}});
    res.json({
        'method':'sendMessage',
        'chat_id':req.body.message.chat.id,
        'text':req.body.message.text,
    })
});

module.exports = router;