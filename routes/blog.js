const router = require('express').Router()

const verify  = require('./verifyToken');
const Post = require('../models/Post')
const {User} = require('../models/User')

router.get('/',async (req,res)=>{
    const { page = 1, limit = 10 } = req.query;
    try {
        // execute query with page and limit values
        let posts = await Post.find()
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .exec();
          let _posts = []
        for( let p of posts){
            const u = await User.findById(p.author)
            let _p = {author:{
                name: u.name,
                _id: u._id,
                profileImage: u.profileImage
            },
            title:p.title,
            time: p.time,
            public: p.public,
            id: p._id,
            project: p.project,
            blocks: JSON.parse(p.blocks)
        }
            _posts.push(_p)
        }
        // get total documents in the Post collection 
        const count = await Post.countDocuments();
    
        // return response with posts, total pages, and current page
        // res.json({
        //   posts,
        //   totalPages: Math.ceil(count / limit),
        //   currentPage: page
        // });
        res.json(_posts);
    } catch (err) {
        res.status(500).send('some issue happend')
        console.error(err.message);
    }
});

router.get('/post/:id',async (req, res)=>{
    const {id} = req.params
    try{
        const post = await Post.findById(id)
        const u = await User.findById(post.author)
        res.json({
            author:{
                name: u.name,
                _id: u._id,
                profileImage: u.profileImage
            },
            title:post.title,
            time: post.time,
            public: post.public,
            id: post._id,
            project: post.project,
            blocks: JSON.parse(post.blocks)
        })
    }catch(err){
        res.status(500).send('some issue happend')
        console.error(err.message);
    }
})

router.post('/new',verify, async (req, res)=>{
    // console.log(req.body)
    const {title,project,public,time,blocks}= req.body
    if(!title || !project  || !time || !blocks)
        return res.status(400).send('some fields are missimg')
    try{
        let _blocks = JSON.stringify( blocks)
        let post = new Post({title,project,author:req.user._id,public,time,blocks:_blocks})
        await post.save()
        res.send('post saved correctly');
    }catch(e){
        res.status(500).send('some issue happend')
        console.log(e);
    }
})

module.exports = router