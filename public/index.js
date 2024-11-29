const STORAGE_THEME_PEREFERENCE = 'THEME_PEREFERENCE';
const SORAGE_THEME_PALLETE = 'THEME_PALLETE';
const THEME_PREF_ATTRIBUTE = 'data-pref';
const THEME_PALLETE_ATTRIBUTE = 'data-pallete';
const THEME_PANEL_OPEN_CLASS = 'theme_panel_open';
const WORKER_PATH = '/worker.js';



class Theme{
    btn= document.getElementById('theme__btn');
    closeBtn= document.getElementById('theme__close__btn');
    backdrop= document.querySelector('.theme__backdrop');
    panel = document.querySelector('.theme__panel');
    preferenceBtns = document.querySelectorAll('#theme__preference__list input');
    palleteBtns = document.querySelectorAll('#theme__pallete__list input');
    constructor(){
        this.getPrefernce();
        this.getPallete();
        this.btn.onclick = ()=>{
            document.body.classList.add(THEME_PANEL_OPEN_CLASS);
        }
        this.closeBtn.onclick = ()=>{
            document.body.classList.remove(THEME_PANEL_OPEN_CLASS);
        }
        this.backdrop.onclick = ()=>{
            document.body.classList.remove(THEME_PANEL_OPEN_CLASS);
        }
        document.body.addEventListener ('keydown', (e)=>{
            if(e.key == 'Escape')
                document.body.classList.remove(THEME_PANEL_OPEN_CLASS);
        });
        this.preferenceBtns.forEach(btn=>{
            btn.onchange = ()=>{
                if(btn.checked)
                    this.setPreference(btn.getAttribute(THEME_PREF_ATTRIBUTE));
            }
            
        })
        this.palleteBtns.forEach(btn=>{
            btn.onchange = ()=>{
                if(btn.checked)
                    this.setPallete(btn.getAttribute(THEME_PALLETE_ATTRIBUTE));
            }
            
        })
    };
    setPreference = (pref)=> {
        localStorage.setItem(STORAGE_THEME_PEREFERENCE,pref);
        document.body.setAttribute(THEME_PREF_ATTRIBUTE,pref);
    }
    getPrefernce = ()=>{
        const pref= localStorage.getItem(STORAGE_THEME_PEREFERENCE) || 'default';
        document.body.setAttribute(THEME_PREF_ATTRIBUTE,pref);
        this.preferenceBtns.forEach(btn=>{
            if(pref === btn.getAttribute(THEME_PREF_ATTRIBUTE))
                btn.setAttribute('checked', true);
        });
    }
    
    setPallete = (pallete)=> {
        localStorage.setItem(SORAGE_THEME_PALLETE,pallete);
        document.body.setAttribute(THEME_PALLETE_ATTRIBUTE,pallete);
    }
    getPallete = ()=>{
        const pallete= localStorage.getItem(SORAGE_THEME_PALLETE) || '1';
        document.body.setAttribute(THEME_PALLETE_ATTRIBUTE, pallete);
        this.palleteBtns.forEach(btn=>{
            if(pallete === btn.getAttribute(THEME_PALLETE_ATTRIBUTE))
                btn.setAttribute('checked', true);
        });
    }
    
}

function elementFactory(name, classes, id, text, attributes){
    if(!name) return;
    this.element = document.createElement(name);
    if(id) this.element.id = id;
    if(typeof classes === 'string') classes = classes.split(' ');
    if(Array.isArray(classes)) this.element.classList.add(...(classes.filter(item => item)));
    if(text) this.element.textContent = text;
    for( att in attributes){
        this.element.setAttribute(att, attributes[att]);
    }
    return this.element;
}

function ErrorUL() {
    const ul = elementFactory('ul', 'error', undefined, undefined, { 'role': 'list' });
    const li1 = elementFactory('li', undefined, undefined, 'Failed loading content');
    const li2 = elementFactory('li', undefined, undefined, 'Check network connection');
    const li3 = elementFactory('li', undefined, undefined, 'Try again later');
    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);
    return ul;
}

async function Posts() {
    const originalUl = document.querySelector('#posts ul');
    try {
        const res = await fetch('/api/blog');
        const json = await res.json();
        const ul = elementFactory('ul', undefined, undefined, undefined, { 'role': 'list' });
        originalUl.replaceWith(ul);
        json.forEach(({ id, title, author:{name, profileImage}, time, project, blocks }) => {
            const li = elementFactory('li');
            const postInfo = elementFactory('div', 'post__info');
            const postImg = elementFactory('img', 'post__img', undefined, undefined, {src:profileImage, alt:'Author\'s profile image'});
            const postTitle = elementFactory('h3', 'post__title');
            const a = elementFactory('a', undefined, undefined,title, {href: `/blog/post/${id}`} );
            postTitle.appendChild(a);
            const postMeta = elementFactory('div', 'post__meta');
            const postAuthor = elementFactory('span', 'post__author', undefined, name);
            const postDate = elementFactory('span', 'post__date  dot_before', undefined, new Date(time).toISOString().substr(0,10));
            postMeta.appendChild(postAuthor);
            postMeta.appendChild(postDate);
            postInfo.appendChild(postImg);
            postInfo.appendChild(postTitle);
            postInfo.appendChild(postMeta);
            const postContent = blocks[0].type === 'paragraph'?
                                     elementFactory('p', 'post__content', undefined, blocks[0].data.text)
                                     : blocks[0].type === 'image' ? 
                                        elementFactory('img', 'post__content', undefined, undefined, {'src': blocks[0].data.file.url})
                                        : elementFactory('br');
            li.appendChild(postInfo);
            li.appendChild(postContent);
            ul.appendChild(li);
        });
    }catch(e){
        const ul = ErrorUL();
        originalUl.replaceWith(ul);
    }
}

async function Downloads(){
    const originalUl = document.querySelector('#downloads ul');
    try {
        const res = await fetch('/api/download/files');
        const json = await res.json();
        const ul = elementFactory('ul', undefined, undefined, undefined, { 'role': 'list' });
        originalUl.replaceWith(ul);
        json.forEach(({ name, modified, size }) => {
            const li = elementFactory('li');
            const a = elementFactory('a', 'download__title', undefined, name, { 'href': `/downloads/${encodeURI(name)}` });
            const spanSize = elementFactory('span', 'download__size', undefined, formatSize(size));
            const spanTime = elementFactory('span', 'download__time', undefined, modified);
            const aDownload = elementFactory('a', 'download__btn', undefined, 'Download', { 'href': `/downloads/${encodeURI(name)}`, 'download': name });
            li.appendChild(a);
            li.appendChild(spanSize);
            li.appendChild(spanTime);
            li.appendChild(aDownload);
            ul.appendChild(li);
        })
    } catch (e) {
        const ul = ErrorUL();
        originalUl.replaceWith(ul);
    }

    function formatSize(size){
        return (size > 1024)?
                    ((size > 1024 * 1024)?
                         (size / 1024 /1024).toFixed(2) + ' MB'
                    : (size / 1024).toFixed(2) + ' KB') 
                : size + ' B'   ;
    }
}

function addWorker() {
    'use strict';
    if ('serviceWorker' in navigator) {
        window.onload = async () => {
            navigator.serviceWorker.register(WORKER_PATH);
            const registration = await navigator.serviceWorker.ready;
            let subscription = await registration.pushManager.getSubscription();
            if(!subscription){
                const response = await fetch('/vapidPublicKey');
                const vapidPublicKey = await response.text();
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: vapidPublicKey
                });
            }
            fetch('/register', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    subscription: subscription
                }),
            });
        }
    }
}

function Gtag(){
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-V95FG9MK9N');
}

async function Eruda(){
    var src = '//cdn.jsdelivr.net/npm/eruda';
    if (!/eruda=true/.test(window.location) && localStorage.getItem('active-eruda') != 'true') return;
    await importScripts([src]);
    eruda.init();
}


new Theme();
Posts();
Downloads();
addWorker();
Gtag();
Eruda();