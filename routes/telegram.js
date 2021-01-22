const router = require('express').Router();

router.post('/'+process.env.TELEGRAM_TOKEN+'/update',async (req,res)=>{
    console.log(req.body);
});

module.exports = router;