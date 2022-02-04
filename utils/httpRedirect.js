/*
this function go through redirects with location header

*/
const urlModule = require('url');
const http = require('http');
const https = require('https');

function httpRedirect(url, referer){
    let opts ={headers:{}}
    if(referer)opts.headers.referer = referer
    const urlObj = urlModule.parse(url);
    let protocol;
    if(urlObj.protocol == 'https:'){
        protocol = https
    } else {
        protocol = http
    }
    return new Promise(async(resolve,rej)=>{
        protocol.get(url,opts,async res => {
            if(res.headers.location){
                let u = await httpRedirect(res.headers.location,url);
                return resolve (u)
            }
            resolve( url);
        })
    })
     
}
module.exports = httpRedirect