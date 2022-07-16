const router = require('express').Router()

const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const verify = require('./verifyToken');

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'profile_images',
    allowedFormats: ['jpg', 'png'],
      transformation: function (req, file, cb) {
      let t = [
        {width: 800, height: 800, crop: "crop"}
      ];
      cb(undefined, t);
    },
    filename: function (req, file, cb) {
      cb(undefined, 'blogImage-'+(new Date().toISOString())+file.originalname.substring(file.originalname.lastIndexOf('.')));
    }
  });

    const fileFilter = (req,file,cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            cb(null,true);
        }else{
            cb(new Error('filetype should be jpeg or png'),false);
        }
    };
    const upload = multer({
        storage:storage , 
        limits:{
            fileSize: 1024*1024*5
            },
        fileFilter: fileFilter              
                          });

router.post('/file',verify,upload.single('image'),(req,res)=>{
    res.json({success:1,
        file:{url:req.file.secure_url}
    })
})


router.post('/url',(req,res)=>{
    res.json({success:1,
        file:{url:req.body.url}
    })
})

module.exports = router