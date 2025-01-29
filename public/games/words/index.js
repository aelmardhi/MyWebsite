let solution = undefined;
let dashes = ['-','-','-','-','-']

const main = document.querySelector('main');
const question = document.getElementById('question');
const empty = document.getElementById('empty');
const input = document.getElementById('input');
const hint = document.getElementById('hint');
const counter = document.getElementById('counter');

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
    let c = solution.length - input.value.length;
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

function setWord(){
    const word = getRandomFromList(data.words);
    solution = word.en;
    console.log(solution);
    dashes = getDashes(word.en.length)
    question.textContent = word.ar;
    setEmpty();
    input.value = '';
    setCounter();
}
setWord();