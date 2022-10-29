const router = require('express').Router()
const puppeteer = require('puppeteer');

let cache = {};

const timezone =  "Africa/Khartoum"
tryLoad(timezone);

router.get('/',async (req, res)=>{

    // const timezone = req.headers.timezone || "Africa/Khartoum"
    if(cache && Object.keys(cache).length){
        return res.json(cache)
    }
    const interval = setInterval(() => {
        if(cache && Object.keys(cache).length){
            clearInterval(interval);
            return res.json(cache)
        }
    }, 500);
    // return res.status(202).send("not ready yet")
})

async function tryLoad(timezone){

    try{
        const browser = await puppeteer.launch()
        
        const [main,barca]=await Promise.all([getKooraHome(browser,timezone),getKooraTeamImportant(browser,timezone, 63)]);
        
        // browser.close()
        let result = {...main, barca,baseUrl:'https://www.kooora.com/default.aspx',time:  Date()}
        cache = result;
        await LoadNews (browser,timezone);

        // result.news.forEach(async (n) => {
        //     n.text = await updateNews(browser,timezone,n.url);
        // });
        // result.barca.news.forEach(async (n) => {
        //     n.text = await updateNews(browser,timezone,n.url);
        // });
        
    }catch(e){
        // res.status(500).send('some error happend')
        logError()(e)
    }
}

async function LoadNews (browser,timezone){
    const page = await browser.newPage();
    for(let n of cache?.news ){
        n.text = await updateNews(page,timezone,n.url);
    }
    for(let n of cache?.barca?.news ){
        n.text = await updateNews(page,timezone,n.url);
    }
}


async function updateNews(page,timezone,urlQuery){
    try{
        page.emulateTimezone(timezone)
        await page.goto('https://www.kooora.com/default.aspx'+urlQuery,{timeout:300000, waitUntil:"domcontentloaded"});
        return await page.$eval('#content .articlePage .articleBody', el => {
            el.querySelectorAll('div').forEach(element => {
                element.remove();
            });
            return el.innerHTML ;
        });
    }catch(e){
        logError('updateNews::'+urlQuery)(e)
        return null;
    }
    
}




async function getKooraHome(browser,timezone){
    try{
        const page = await browser.newPage()
        page.emulateTimezone(timezone)
        await page.goto('https://www.kooora.com/default.aspx',{timeout:300000, waitUntil:"domcontentloaded"})
    const matches = await page.$eval('.liveMatches > table', el => {
        function parseTD(td){
            if(td.classList.contains('liveTeam')){
                return {
                    img: td.querySelector('img')?.getAttribute('src'),
                    name: td.querySelector('div').textContent,
                }
            }
            else if(td.classList.contains('liveDet')){
                return td.textContent 
            }
            return td.innerHTML
        }
        function parseScoreRow (r){
            return{
                url: /\?m=[0-9]+/.exec(r.onclick.toString())[0],
                home:  parseTD(r.childNodes[0]),
                score: parseTD(r.childNodes[1]),
                away: parseTD(r.childNodes[2]),
            }
        }
        
        let r = []
        trs = el.querySelectorAll('tr')
        let lastScoreIndex = 0;
        for(let i=0;i< trs.length;i++){
            r.push(parseScoreRow(trs[i]))
        }
        
        return  r
    
    }).catch(logError('Home::Matches'))

    let featurednews = await page.$eval('#featuredNews > ul', el => {
        let news = []
        for (let i=0; i< el.childNodes.length; i++){
            let p = el.childNodes[i].querySelector('p');
            news.push({
                url: p.querySelector('a').getAttribute('href'),
                title: p.querySelector('a').textContent,
                img: el.childNodes[i].querySelector('img')?.getAttribute('src'),
                featured: true,
            })
        }
        return news;
    }).catch(logError('Home::FeatueredNews'));

    let news = await page.$eval('.newsList > ul', el => {
        let news = []
        for (let i=0; i< el.childNodes.length && i< 8 ; i++){
            let a = el.childNodes[i].querySelector('div > a');
            if(a)
                news.push({
                    url: a.getAttribute('href'),
                    title: a.textContent,
                    img: el.childNodes[i].querySelector('img')?.getAttribute('src')
                })
        }
        return news;
    }).catch(logError('Home::News'));
    news.push(...featurednews)
    return {news, matches}

}catch(e){
    throw e;
}
}

async function getKooraTeamImportant (browser,timezone, team){
    try{
        const page = await browser.newPage()
        page.emulateTimezone(timezone)
        await page.goto('https://www.kooora.com/default.aspx?team='+team,{timeout:300000, waitUntil:"domcontentloaded"})
  const matches = await page.$eval('.lastMatches > table', el => {
    function parseTD(td){
        const a= td.childNodes[0]
        if(a.tagName == 'A')
        return{
            name: a.textContent,
            href: a.getAttribute('href')
        }
        return a.textContent
    }
    function parseScoreRow (r){
        return{
            competetion: parseTD(r.childNodes[0]),
            time: parseTD(r.childNodes[1]),
            home:  parseTD(r.childNodes[3]),
            score: parseTD(r.childNodes[4]),
            away: parseTD(r.childNodes[5]),
        }
    }
    
    let r = []
    trs = el.querySelectorAll('tr')
    let lastScoreIndex = 0;
    for(let i=0;i< trs.length;i++){
        if(trs[i].childNodes[4].textContent.match(/[0-9]:[0-9]/)){      // if the result in the form 1:5
            lastScoreIndex = i
        }
    }
    
    return  [parseScoreRow(trs[lastScoreIndex]),parseScoreRow(trs[lastScoreIndex+1])]

  }).catch(logError('Team::'+team+'::Matches'));


  let news = await page.$eval('#featuredNews > ul', el => {
        let news = []
        for (let i=0; i< el.childNodes.length; i++){
            let p = el.childNodes[i].querySelector('p');
            news.push({
                url: p.querySelector('a').getAttribute('href'),
                title: p.querySelector('a').textContent,
                img: el.childNodes[i].querySelector('img')?.getAttribute('src'),
                featured: true,
            })
        }
        return news;
    }).catch(logError('Team::'+team+'::FeaturedNews'));

    return {news, matches, team}

}catch(e){
    throw e;
}
}

function logError(m=''){
    return (e)=>console.log('kooora scrape::'+m+'::'+e.message);
}

module.exports = router