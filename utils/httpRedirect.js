/*
this function go through redirects with location header

*/
const urlModule = require('url');
const http = require('http');
const https = require('https');

function httpRedirect(url){
    const url = urlModule.parse(url);
    let protocol;
    if(url.protocol == 'https:'){
        protocol = https
    } else {
        protocol = http
    }
    return new Promise(async(resolve,rej)=>{
        protocol.get(url,async res => {
            if(res.headers.location){
                let u = await getLink(res.headers.location);
                resolve (u)
            }
            resolve( url);
        })
    })
     
}
module.exports = httpRedirect