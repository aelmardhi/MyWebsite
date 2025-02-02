let solution = undefined;
let dashes = ['-','-','-','-','-']
let curentWord = '';

const main = document.querySelector('main');
const question = document.getElementById('question');
const empty = document.getElementById('empty');
const partOfSpeech = document.getElementById('partOfSpeech');
const input = document.getElementById('input');
const hint = document.getElementById('hint');
const counter = document.getElementById('counter');

let defHolder = document.getElementById('defHolder');
let currentWordHolder = document.getElementById('currentWordHolder');

input.oninput=()=>{
    input.value = input.value.replaceAll(' ','').toLowerCase();
    setCounter();
}

input.onchange = ()=>{
    main.classList.remove('success');
    main.classList.remove('error');
    if(input.value !== solution){
        main.classList.add('error');
        setTimeout(()=>{
            main.classList.remove('error');
        }, 500);
        return;
    }
    main.classList.add('success');
    setTimeout(()=>{
        main.classList.remove('success');
        setWord();
    }, 500);
}

hint.onclick = ()=>{
    let indexes = dashes.reduce((p,c,i)=>{
        if(c == '-')
            p.push(i);
        return p;
    },[]);
    const randomIndex = getRandomFromList(indexes);
    dashes[randomIndex] = solution[randomIndex];
    setEmpty();
    input.focus();
}

function setCounter(){
    let c = input.value.length - solution.length;
    if(c>0) c = '+' + c;
    counter.textContent = c;
}

function getRandomFromList(list) {
    const i = Math.floor(Math.random() * list.length);
    return list[i];
}

function getDashes(n){
    let t = []
    for(let i=0; i<n; i++){
        t.push('-');
    }
    return t;
}

function setEmpty() {
    empty.textContent = dashes.join('');
}

function setDefHolder(word){
    const div = elementFactory('div','defHolder','defHolder');
    word.def.forEach(d => {
        const span = elementFactory('span','def',undefined,d);
        div.appendChild(span);
    });
    const a = elementFactory('a',undefined,undefined,'More',{href:word.url});
    div.appendChild(a);
    defHolder.replaceWith(div);
    defHolder = div;
}

function setCurrentWord(word){
    const div = elementFactory('div', 'column currentWordHolder', 'currentWordHolder')
    const h2 = elementFactory('h2', undefined, undefined, 'Solved!');
    const h3 = elementFactory('h3',undefined, undefined, word.en);
    const span = elementFactory('span',undefined, undefined, `- ${word.ar} -`);
    const divDef = elementFactory('div');
    word.def.forEach(d=>{
        const s = elementFactory('span', undefined, undefined, d);
        divDef.appendChild(s);
    });
    const a = elementFactory('a', undefined, undefined, 'More', {href: word.url});
    div.appendChild(h2);
    div.appendChild(h3);
    div.appendChild(span);
    div.appendChild(divDef);
    div.appendChild(a);
    currentWordHolder.replaceWith(div);
    currentWordHolder = div;
}

function setWord(){
    const word = getRandomFromList(data1.words);
    solution = word.en;
    console.log(solution);
    dashes = getDashes(word.en.length)
    question.textContent = word.ar;
    partOfSpeech.textContent = `(${word.part})`;
    setEmpty();
    input.value = '';
    setCounter();
    if(word.def) setDefHolder(word);
    if(curentWord) setCurrentWord(curentWord);
    curentWord = word;
}
setWord();