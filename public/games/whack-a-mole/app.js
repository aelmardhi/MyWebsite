'use strict';

function sound(src) {
    'use strict';
    this.sound = document.createElement("audio");
    this.sound.src = src
    this.sound.setAttribute('preload','auto')
    this.sound.setAttribute('controls','none')
    this.sound.style.display= 'none'
    document.body.appendChild(this.sound)
    this.play = function(){
        this.sound.play()
    }
    this.stop = function() {
        this.sound.pause();
    }
    
}

const square = document.querySelectorAll('.square')
const mole = document.querySelectorAll('.mole')
const timeLeft = document.querySelector('#time-left')
let score = document.querySelector('#score')

let hitPosition = 2
let result = 0
let currentTime = timeLeft.textContent
let timer = 1000;
let timerId1 = null
let timerId2 = null
const hit = new sound('so.mp3') // Crunchy-Punch-A-www.fesliyanstudios.com.mp3 


function randomSquare(){
    square.forEach(className => {
        className.classList.remove('mole')
    })
    let randomPosition = square[Math.floor(Math.random() * 9)]
    do {
    randomPosition = square[Math.floor(Math.random() * 9)]
    }while(randomPosition.id === hitPosition)
        
    randomPosition.classList.add('mole')
    hitPosition = randomPosition.id
}

square.forEach(id => {
    id.addEventListener('mousedown', () => {
        if (id.id === hitPosition && currentTime !== 0){
            result+= 8
            score.textContent = result
            hit.play()
            setTimeout(() => hit.stop(),1000);
    
        }
    })
})

function moveMole() {
    
    //console.log(square)
    timerId2 = setInterval(randomSquare, timer)
}

function countDown() {
    currentTime--
    timeLeft.textContent = currentTime
    
    if (currentTime === 0){
        clearInterval(timerId1)
        clearInterval(timerId2)
        alert('GAME OVER! your final score is '+ result)
    }
}

timerId1 = setInterval(countDown,1000)
moveMole()


function setDiffecality(i){
    switch(i){
        case 0 :
            timer = 1200
            break;
        case 1 :
            timer = 800
            break;
        case 2 :
            timer = 400
            break;
        default:
            timer = 1000
            break;
    }
    clearInterval(timerId1)
    clearInterval(timerId2)
    timerId1 = setInterval(countDown,1000)
    timerId2 = setInterval(randomSquare,timer)
    result = 0
    currentTime = 60
    score.textContent = result
}
