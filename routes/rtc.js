const portNumber = (process.env.PORT || 5000);
const router = require('express').Router();
const {randomUUID} = require('node:crypto')

router.get("/", (req,res)=>{
    res.redirect(`/webRTC?room-id=${randomUUID()}`);
    //res.redirect(`/webRTC?room-id=4&port=${portNumber}`);
});

router.get("/:room", (req, res) => { 
       res.render("room", { roomId: req.param.room });
});

module.exports = router;