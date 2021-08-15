let speed = 0.9
let intervalTime = 0

document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const width = 20;
    let squares = []
    const grid = document.querySelector('.grid')
    for (let i =0 ; i < width * width; i++ ){
        let ele = document.createElement('div')
        grid.appendChild(ele)
        squares.push(ele)
    }
         
         
//    const squares = document.querySelectorAll('.grid div')
    const scoreDisplay = document.querySelector('.score span')
    const startBtn = document.querySelector('.start')
    const up = document.querySelector('.up')
    const left = document.querySelector('.left')
    const right = document.querySelector('.right')
    const down = document.querySelector('.down')
    
    let currentIndex = 0
    let appleIndex = 0
    let currentSnake = [2,1,0]
    let directon = 1
    let score = 0
    
    
    let interval = 0
    let oldDirection = -1850	
    
    
   
    /// initialize squares
    
    
    function startGame () {
        currentSnake.forEach(index => squares[index].classList.remove('snake'))
        squares[appleIndex].classList.remove('apple')
        clearInterval(interval)
        score = 0
        randomApple()
        directon = 1
        oldDirection = -1850
        scoreDisplay.textContent = score
        intervalTime = 1000
        currentSnake = [2,1,0]
        currentIndex = 0
        currentSnake.forEach(index => squares[index].classList.add('snake'))
        interval = setInterval(moveOutcomes , intervalTime)
    }
    
    
    function moveOutcomes() {
        if ((currentSnake[0] + width >= (width * width) && directon === width) || (currentSnake[0] % width === width - 1 && directon === 1) ||
        (currentSnake[0] - width < 0 && directon === -width) || (currentSnake[0] % width === 0 && directon === -1) ||
        squares[currentSnake[0] + directon].classList.contains('snake')    
           ) {
            score = score + ' - GAME OVER'
            scoreDisplay.textContent = score
            return clearInterval(interval)
        }
        
        const tail = currentSnake.pop()
        squares[tail].classList.remove('snake')
        currentSnake.unshift(currentSnake[0] + directon)
        
        if (squares[currentSnake[0]].classList.contains('apple')){
            squares[currentSnake[0]].classList.remove('apple')
            squares[tail].classList.add('snake')
            currentSnake.push(tail)
            randomApple()
            score++
            scoreDisplay.textContent = score
            clearInterval(interval)
            intervalTime *= speed
            interval = setInterval(moveOutcomes, intervalTime)
        }
	oldDirection  = directon
        squares[currentSnake[0]].classList.add('snake')
    }
    
    function randomApple() {
        do {
            appleIndex = Math.floor(Math.random() * width *width)
        } while(squares[appleIndex].classList.contains('snake'))
        squares[appleIndex].classList.add('apple')
	
    }
    
    
    
    function control (a){
        //squares[currentIndex].classList.remove('snake')
        
        if(a === 39){
            directon = 1
        }else if (a === 38){
            directon = - width
        }else if (a === 37){
            directon = -1 ;
        }else if (a === 40){
            directon = width
        }
        if (directon === -oldDirection){
            directon = oldDirection
        }
    }

    document.addEventListener('keyup', (e) => control(e.keyCode))
    startBtn.addEventListener('click', startGame)
    up.addEventListener('click',(e) => control(38))
    left.addEventListener('click',(e) => control(37))
    right.addEventListener('click',(e) => control(39))
    down.addEventListener('click',(e) => control(40))

        })
function setDefecalty(r){
    switch(r) { 
        case 0 : speed = 0.99; intervalTime = 800;  break;
        case 1 : speed = 0.9; intervalTime = 1000;  break;
        case 2 : speed = 0.85; intervalTime = 800;  break;
        default: speed = 0.9; intervalTime = 1000;  break;
    }
}
