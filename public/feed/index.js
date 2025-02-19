const storageName = 'feed-kooora'

async function loadFeed(){
    const data = localStorage.getItem(storageName);
    if(data){
        json = JSON.parse(d);
        Feed(json);
    }
    try {
        const raw = await fetch('https://chato.onrender.com/api/scrape/kooora');
        const json = await raw.json();
        localStorage.setItem(storageName, JSON.stringify(json));
        Feed(json);
    } catch (error) {
        console.log(error);
        const el = elementFactory('h3', 'error', undefined, 'Sorry, we have a problem');
        document.getElementById('details__list').replaceWith(el);
    }
}
    

function Feed(data){
    function putpost(id){
        list.forEach(([li,article])=>{
            li.setAttribute('data-selected',false);
        })
        list[id][0].setAttribute('data-selected', true);
    }
    
    const listElement = elementFactory('ul', 'list column', 'list');
    const detailsList = elementFactory('ul', 'details__list', 'details__list');
    let list = [];
    const matchLi = elementFactory('li','matches__bg');
    matchLi.appendChild(elementFactory('span',undefined,undefined,'المباريات'));
    list.push([matchLi, Matches(data)]);
    list = list.concat(News(data));
    
    document.getElementById('list').replaceWith(listElement);
    document.getElementById('details__list').replaceWith(detailsList);

    list.forEach(([li,article],index)=>{
        listElement.appendChild(li);
        li.onclick = ()=>{
            article.scrollIntoViewIfNeeded(false);
            putpost(index);
        }
        const li2 = elementFactory('li');
        li2.appendChild(article);
        detailsList.appendChild(li2);
    })
}

function Matches({baseUrl, matches, barca}){
    const article = elementFactory('article', 'matches');
    const div = elementFactory('div', 'details__header');
    const h2 = elementFactory('h2',undefined,undefined,'المباريات');
    const img = elementFactory('div', 'matches__bg img')
    div.appendChild(h2);
    div.appendChild(img)
    article.appendChild(div)
    const ul = elementFactory('ul','content',undefined,undefined,{'role':'list'});
    article.appendChild(ul);
    matches.forEach(({url,score,time,competition,home,away}) => {
        const li = elementFactory('li');
        const a = elementFactory('a','match',undefined,undefined,{'href':baseUrl+url});
        a.appendChild(MatchTeam(home));
        const score1 = elementFactory('big','score1',undefined,score[0]);
        const competitionSpan = elementFactory('span','competition',undefined,competition);
        const timeSpan = elementFactory('span','time', undefined, time);
        const score2 = elementFactory('big','score2',undefined,score[1]);
        a.appendChild(score1);
        a.appendChild(competitionSpan);
        a.appendChild(timeSpan);
        a.appendChild(score2);
        a.appendChild(MatchTeam(away));
        li.appendChild(a);
        ul.appendChild(li);
    });
    barca.matches.forEach(({competition,time,score,home,away})=>{
        const li = elementFactory('li','barca match');
        const competitionA = elementFactory('a', 'competition', undefined, competition.name, {'href':baseUrl + competition.href});
        const homeA = elementFactory('a', 'home', undefined, home.name, {'href':baseUrl + home.href});
        const scoreA = elementFactory('a', 'score', undefined, score.name, {'href':baseUrl + score.href});
        const awayA = elementFactory('a', 'away', undefined, away.name, {'href': baseUrl + away.href});
        const timeSpan = elementFactory('span', 'time', undefined, time);
        li.appendChild(competitionA);
        li.appendChild(homeA);
        li.appendChild(scoreA);
        li.appendChild(awayA);
        li.appendChild(timeSpan);
        ul.appendChild(li);
    })
    return article;
}

function MatchTeam({name, img}){
    const div = elementFactory('div');
    const imgElement = elementFactory('img',undefined,undefined,undefined,{'src':img, 'alt':`Image of team ${name}`});
    const title = elementFactory('span',undefined,undefined,name);
    div.appendChild(imgElement);
    div.appendChild(title);
    return div
}

function News({baseUrl,news,barca}){
    news = news.concat(barca.news);
    return news.map(({url,title,img,text,featured})=>{
        const article = elementFactory('article');
        const div = elementFactory('div', 'details__header');
        const imgElement = elementFactory('img', 'img', undefined, undefined, {'src':img, 'alt':`image of post ${title}`});
        const h2 = elementFactory('h2','title',undefined,title);
        const more = elementFactory('a', 'more', undefined, 'المزيد', {'href': baseUrl+url});
        div.appendChild(imgElement);
        div.appendChild(h2);
        div.appendChild(more);
        const p = elementFactory('p', 'content', undefined, undefined, {'innerHTML': text});
        p.innerHTML = text
        article.appendChild(div);
        article.appendChild(p);
        const li = elementFactory('li',featured && 'featured');
        const imgElement2 = elementFactory('img', 'img', undefined, undefined, {'src':img, 'alt':`image of post ${title}`});
        const span = elementFactory('span','title',undefined,title);
        li.appendChild(imgElement2);
        li.appendChild(span);
        return [li, article];
    })
}

loadFeed()