const router = require('express').Router()
const puppeteer = require('puppeteer');



router.get('/',async (req, res)=>{
    try{
        const browser = await puppeteer.launch()

        const main = await getKooraHome(browser)
        const barca = await getKooraTeamImportant(browser, 63)
        browser.close()

        return res.json({...main, barca,baseUrl:'https://www.kooora.com/default.aspx',time: new Date()})
    }catch(e){
        res.status(500).send('some error happend')
    }
})







async function getKooraHome(browser){

    const page = await browser.newPage()
    await page.goto('https://www.kooora.com/default.aspx',{timeout:100000})
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
                url: /\?m=[1-9]+/.exec(r.onclick.toString())[0],
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
    
    
    })

    let featurednews = await page.$eval('#featuredNews > ul', el => {
        let news = []
        for (let i=0; i< el.childNodes.length; i++){
            let p = el.childNodes[i].querySelector('p');
            news.push({
                url: p.querySelector('a').getAttribute('href'),
                text: p.querySelector('a').textContent,
                img: el.childNodes[i].querySelector('img')?.getAttribute('src'),
                featured: true,
            })
        }
        return news;
    })

    let news = await page.$eval('.newsList > ul', el => {
        let news = []
        for (let i=0; i< el.childNodes.length && i< 8 ; i++){
            let a = el.childNodes[i].querySelector('div > a');
            if(a)
                news.push({
                    url: a.getAttribute('href'),
                    text: a.textContent,
                    img: el.childNodes[i].querySelector('img')?.getAttribute('src')
                })
        }
        return news;
    })
    news.push(...featurednews)
    return {news, matches}
}

async function getKooraTeamImportant (browser, team){
    const page = await browser.newPage()
  await page.goto('https://www.kooora.com/default.aspx?team='+team,{timeout:100000})
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

  })


  let news = await page.$eval('#featuredNews > ul', el => {
        let news = []
        for (let i=0; i< el.childNodes.length; i++){
            let p = el.childNodes[i].querySelector('p');
            news.push({
                url: p.querySelector('a').getAttribute('href'),
                text: p.querySelector('a').textContent,
                img: el.childNodes[i].querySelector('img')?.getAttribute('src'),
                featured: true,
            })
        }
        return news;
    })

    return {news, matches, team}
}


module.exports = router