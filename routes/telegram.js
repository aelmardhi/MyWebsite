const router = require('express').Router();

router.post('/update',async (req,res)=>{
    console.log(req.body);
    res.json({
        'method':'sendMessage',
        'chat_id':req.body.message.chat.id,
        'text':req.body.message.text,
    })
});

module.exports = router;