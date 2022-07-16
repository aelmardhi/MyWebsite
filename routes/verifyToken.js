const jwt = require('jsonwebtoken');

module.exports = function (req,res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access denied');
    
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err){
        res.status(400).send('Invaled Token');
    }
}

module.exports.lenientVerify = function(req, res, next){
    const token = req.header('auth-token');
    if (!token) {
        req.user = 'header missing';
        return next();
    }
    
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err){
        req.user = 'cant verify';
        return next();
    }
}