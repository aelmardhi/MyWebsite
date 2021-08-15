let speed = 0.9
let intervalTime = 500

document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    let timerId
    const width = 15;
    const height = 20;
    let score = 0
    let currentPosition = 4
    const displaySquares = document.querySelectorAll('.next-grid div')
    const startBtn = document.querySelector('.start')
    const scoreDisplay = document.querySelector('.score span')
    const up = document.querySelector('.up')
    const down = document.querySelector('.down')
    const left = document.querySelector('.left')
    const right = document.querySelector('.right')
    const grid = document.querySelector(".grid")
    /// initialize squares
    for (let i = 0;i < height;i++){
        for (let j = 0;j < width;j++){
            let ele = document.createElement('div')
            ele.classList.add('square')
            grid.appendChild(ele)
        }
    }
    let squares = Array.from(grid.querySelectorAll('div'))
    
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]
    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [1, width, width+1, width*2],
        [width, width+1, width*2+1, width*2+2]
    ]
    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]
    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
    ]
    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]
    
    const theTetrominos =[
        lTetromino, zTetromino, tTetromino, oTetromino, iTetromino
    ]
    
    let random = Math.floor(Math.random()*theTetrominos.length)
    let currentRotation = 0
    let current = theTetrominos[random][currentRotation]
    
    
    function draw () {
        current.forEach( index => {
            squares[currentPosition+index].classList.add('block')
        })
    }
    function undraw () {
        current.forEach( index => {
            squares[currentPosition+index].classList.remove('block')
        })
    }
    
    function moveDown() {
        undraw()
        currentPosition +=  width
        draw()
        freeze()
    }
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition+index)%width === width-1)
        if (!isAtRightEdge) currentPosition++
        if (current.some(index => squares[currentPosition+index].classList.contains('block2'))){
            currentPosition--
        }
        draw()
    }
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition+index)%width === 0)
        if (!isAtLeftEdge) currentPosition--
        if (current.some(index => squares[currentPosition+index].classList.contains('block2'))){
            currentPosition++
        }
        draw()
    }
    
    function rotate() {
        undraw()
        currentRotation++
        if(currentRotation === current.length){
            currentRotation = 0
        }
        current = theTetrominos[random][currentRotation]
        draw()
    }
    /////////////////next shape
    const displayWidth = 4
    const displayIndex = 0
    let nextRandom = 0
    
    const smallTetrominos = [
        [1, displayWidth+1, displayWidth*2+1, 2],   //l 
        [0, displayWidth, displayWidth+1, displayWidth*2+1],    //z
        [1, displayWidth,   displayWidth+1, displayWidth+2],    //t
        [0, 1, displayWidth, displayWidth+1],   //o
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //i
    ]
    
    function displayShape() {
        displaySquares.forEach(square => square.classList.remove('block'))
        smallTetrominos[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('block')
        })
    }
    
    
    function freeze() {
        if (current.some(index => (currentPosition+index+width>width*height-1) || squares[currentPosition+index+width].classList.contains("block3")  ||  squares[currentPosition+index+width].classList.contains("block2"))){
            current.forEach(index => squares[index +currentPosition].classList.add('block2'))
            
            random = nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominos.length)
            current = theTetrominos[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            gameOver()
            addScore()
        }
    }
    
    function gameOver() {
        if (current.some(index => 
            squares[currentPosition+index].classList.contains('block2')
        )){
            scoreDisplay.textContent =score + '  end'
            clearInterval(timerId)
        }
    }
    
    function addScore() {
        for (let i = 0 ;i<height;i++){
            let have = true
            for(let j = 0; j< width; j++){
                if (!(squares[i*width+j].classList.contains('block2') || squares[i*width+j].classList.contains('block2'))){
                    have = false
                    break
                }
            }
            if (have){
                for(let j = 0; j< width; j++){
                    squares[i*width+j].classList.remove('block2')
                    squares[i*width+j].classList.remove('block')
                }
                score += 10
                scoreDisplay.textContent= score
                const removed = squares.splice(i*width,width) 
                squares = removed.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }
    
    function control (a){
        //squares[currentIndex].classList.remove('snake')
        
        if(a === 39){
            moveRight()
        }else if (a === 38){
            rotate()
        }else if (a === 37){
            moveLeft()
        }else if (a === 40){
            moveDown()
        }
        
    }

    document.addEventListener('keyup', (e) => control(e.keyCode))
    startBtn.addEventListener('click', () => {
        if (timerId){
            clearInterval(timerId)
            timerId = null
        }else {
            draw()
            timerId = setInterval(moveDown, intervalTime)
            nextRandom = Math.floor(Math.random()*theTetrominos.length)
            displayShape()
            
        }
    })
    up.addEventListener('click',(e) => control(38))
    left.addEventListener('click',(e) => control(37))
    right.addEventListener('click',(e) => control(39))
    down.addEventListener('click',(e) => control(40))

        })
function setDefecalty(r){
    switch(r) { 
        case 0 : intervalTime = 1000;  break;
        case 1 : intervalTime = 500;  break;
        case 2 : intervalTime = 200;  break;
        default: intervalTime = 1000;  break;
    }
}
