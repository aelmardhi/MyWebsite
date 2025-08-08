const router = require('express').Router()

const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const verify = require('./verifyToken');

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'images',
    allowedFormats: ['jpg', 'png'],
    filename: function (req, file, cb) {
      cb(undefined, 'Image-'+(new Date().toISOString())+file.originalname.substring(file.originalname.lastIndexOf('.')));
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

router.get('/', async (req, res) => {
  const maxResults = parseInt(req.query.limit) || 10;
  const nextCursor = req.query.next_cursor || null;

  try {
    const result = await cloudinary.v2.search
      .expression('folder:images')
      .sort_by('created_at', 'desc')
      .max_results(maxResults)
      .next_cursor(nextCursor)
      .execute();

    const images = result.resources.map(img => ({
      url: img.secure_url,
      public_id: img.public_id,
      created_at: img.created_at
    }));

    res.json({
      success: 1,
      images,
      next_cursor: result.next_cursor || null
    });
  } catch (err) {
    console.error('Cloudinary search error:', err);
    res.status(500).json({ success: 0, error: 'Failed to retrieve images' });
  }
});

router.delete('/',verify, async (req, res) => {
  const public_id = req.query.public_id || null;
  if(!public_id)
    return res.json({
      success:0,
      err: 'Missing parameter',
    })

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    console.log('Delete result:', result);

    res.json({
      success: 1,
      result,
    });
  } catch (err) {
    console.error('Cloudinary delete error:', err);
    res.status(500).json({ success: 0, error: 'Failed to delete image' });
  }
});


module.exports = router