let solution = undefined;
let dashes = ['-','-','-','-','-']
let curentWord = '';
let dataSelector = 1;

const LOCALSTORAGE_NAME = 'WORDS_DATASET_SELECTOR_INDEX';
const datasets = [data0, data1];

const main = document.querySelector('main');
const question = document.getElementById('question');
const empty = document.getElementById('empty');
const partOfSpeech = document.getElementById('partOfSpeech');
const input = document.getElementById('input');
const hint = document.getElementById('hint');
const counter = document.getElementById('counter');
const dataSelectRadios = document.querySelectorAll('input[name="dataSelect"]');

let defHolder = document.getElementById('defHolder');
let currentWordHolder = document.getElementById('currentWordHolder');

function setDataset(dataset){
    dataSelector = parseInt(dataset);
    localStorage.setItem(LOCALSTORAGE_NAME, dataset)
    setWord(false);
}

function getDataset() {
    return datasets[dataSelector] || data1;
}

function Options(){
    dataSelectRadios.forEach(radio=>{
        radio.onchange = ()=>{
            if(radio.checked)
                setDataset(radio.dataset.id);
        }
    });
    const value = localStorage.getItem(LOCALSTORAGE_NAME);
    setDataset(value);
    if(value){
        dataSelectRadios.forEach(radio=>{
            if(radio.dataset.id == value)
                radio.setAttribute('checked', true);
        });
    }
}

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
        setWord(true);
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
    if(!word.def){
        const div = elementFactory('div',undefined, 'defHolder')
        defHolder.replaceWith(div);
        defHolder = div;
        return
    }
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
    if(word.def)
        word.def.forEach((d,i)=>{
            const s = elementFactory('span', i>0? 'dot_before': undefined, undefined, d);
            divDef.appendChild(s);
        });
    div.appendChild(h2);
    div.appendChild(h3);
    div.appendChild(span);
    div.appendChild(divDef);
    if(word.url) {
        const a = elementFactory('a', undefined, undefined, 'More', {href: word.url});
        div.appendChild(a);
    }
    currentWordHolder.replaceWith(div);
    currentWordHolder = div;
}

function setWord(solved){
    const word = getRandomFromList(getDataset().words);
    solution = word.en;
    console.log(solution);
    dashes = getDashes(word.en.length)
    question.textContent = word.ar;
    partOfSpeech.textContent = word.part?`(${word.part})` : '';
    setEmpty();
    input.value = '';
    setCounter();
    setDefHolder(word);
    if(solved && curentWord) setCurrentWord(curentWord);
    curentWord = word;
}
setWord();
Options();