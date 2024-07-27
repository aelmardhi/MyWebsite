const router = require('express').Router()
const puppeteer = require('puppeteer');

const baseURL ='https://www.kooora.com/';
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
        let result = {...main, barca,baseUrl:baseURL,time:  Date()}
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
        await page.goto(baseURL+urlQuery,{timeout:300000, waitUntil:"domcontentloaded"});

        await page.waitForSelector('#content .articlePage .articleBody');
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
        await page.goto(baseURL,{timeout:300000, waitUntil:"domcontentloaded"})
        
        await page.waitForSelector('.liveMatches .flickity-slider');
     
    const matches = await page.$eval('.liveMatches .flickity-slider', el => {
        
        function parseTDTeam(td){
            return {
                img: td.querySelector('img')?.getAttribute('src'),
                name: td.querySelector('span')?.textContent,
            };
        }
        function parseTDScore(tr){
            return [tr.querySelector('.score1')?.textContent,
               tr.querySelector('.score2')?.textContent];
        }
        function parseTDCompetition(tr){
            return tr.querySelector('.compName')?.textContent;
        }
        function parseTDTime(tr){
            return tr.querySelector('.fperiod, .period')?.innerText;
        }
        function parseScoreRow (r){
            return{
                url: '?m='+r.getAttribute('onclick'),
                home:  parseTDTeam(r.childNodes[1]),
                competition: parseTDCompetition(r),
                away: parseTDTeam(r.childNodes[2]),
                score: parseTDScore(r),
                time: parseTDTime(r),
            }
        }
        
        let r = []
        trs = el.querySelectorAll('.matchRow')
        let lastScoreIndex = 0;
        for(let i=0;i< trs.length;i++){
            r.push(parseScoreRow(trs[i]))
        }
        
        return  r
    
    }).catch(logError('Home::Matches'))

    await page.waitForSelector('.newsList.topNews');    
    let featurednews = await page.$eval('.newsList.topNews', el => {
        let news = []
        let ps = el.querySelectorAll('.aCard');
        for (let i=0; i< ps.length; i++){
            let p = ps[i];
            news.push({
                url: p.querySelector('a').getAttribute('href'),
                title: p.querySelector('.aTitle').textContent,
                img: p.querySelector('img')?.getAttribute('src'),
                featured: true,
            })
        }
        return news;
    }).catch(logError('Home::FeatueredNews'));
        
    await page.waitForSelector('.newsList.longList');
    let news = await page.$eval('.newsList.longList', el => {
        let news = []
        let list = el.querySelectorAll('.aCard')
        for (let i=0; i< list.length ; i++){
            let a = list[i].querySelector('.aTitle > a');
            if(a)
                news.push({
                    url: a.getAttribute('href'),
                    title: a.textContent,
                    img: list[i].querySelector('img')?.getAttribute('src')
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
        await page.goto(baseURL+'?team='+team,{timeout:300000, waitUntil:"domcontentloaded"});

        await page.waitForSelector('.lastMatches > table');
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

  await page.waitForSelector('#featuredNews > ul');
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
