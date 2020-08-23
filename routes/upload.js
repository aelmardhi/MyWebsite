const fs = require('fs');
const router = require('express').Router();

const multer = require('multer');
//upload = multer({ dest: './public/downloads/' })
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,  __dirname+'/../public/downloads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname )
  }
})

var upload = multer({ storage: storage })


router.post('/',upload.single('file') ,async (req , res) => {
    if(!(req.file)){
        res.status(400).send('no file uploaded')
    }
    res.status(200).send('file uploaded successfuly')
});

module.exports = router;