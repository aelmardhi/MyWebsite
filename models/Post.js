const mongoose = require('mongoose');

    postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref:'User'
    },
    public: {
        type: Boolean,
        default:false,
    },
    project: {
        type: String,
        default: 'none'
    },
    time: {
        type: Date
    },
    blocks: {
        type: String
    }
});
let Post
    try{
        Post = mongoose.model('Post');
       
    }catch(err){
        Post =    mongoose.model('Post', postSchema);
    }
    


module.exports = Post;