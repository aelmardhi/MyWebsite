const router = require('express').Router();

router.post('/update',async (req,res)=>{
    console.log(req.body);
    res.send('ok')
});

module.exports = router;