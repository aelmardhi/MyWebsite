
const fs = require('fs');

var html404;
try{
html404 = fs.readFileSync('404.html').toString();
} catch(e){
html404 = '404: not found';
}



module.exports = function (app) {
    // if no page match
    app.use((req, res) => {
        res.status(404).header({
            accept: 'text/html',
        }).send(html404 ? html404 : '404:not Found');
    });

    app.use((err, req, res, next) => {
        console.error(`${err.name} : ${err.message} --- ${err.stack}`)
        res.status(500).send('Something broke!')
    });
}