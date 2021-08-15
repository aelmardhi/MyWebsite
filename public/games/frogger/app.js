let speed = 0.9
let intervalTime = 2000

document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const width = 27;
    const river1 = 2
    const river2 = 8
    const river3 = 18
    const road1 = 5
    const road2 = 11
    const road3 = 14
    const road4 = 21
    const road5 = 23
    const startIndex = width * width - Math.ceil(width/2) 
    const endIndex = Math.floor(width/2)
    let squares = []
    const grid = document.querySelector('.grid')
    for (let i =0 ; i < width * width; i++ ){
        let ele = document.createElement('div')
        grid.appendChild(ele)
        squares.push(ele)
    }
    
    squares[endIndex].classList.add('ending-block')
    squares[startIndex].classList.add('starting-block')
    function drawRiver(river) {
        for (let i =river*width ; i < (river + 1) * width; i++ ){
            squares[i].classList.add('log-left')
        }
        for (let i =(river + 1)*width ; i < (river + 2) * width; i++ ){
            squares[i].classList.add('log-right')
        }
        for (let i = river*width ; i < (river + 2) * width; i++ ){
            switch(i%5){
                case 0:
                    squares[i].classList.add('l1')
                    break
                case 1:
                    squares[i].classList.add('l2')
                    break
                case 2:
                    squares[i].classList.add('l3')
                    break
                case 3:
                    squares[i].classList.add('l4')
                    break
                case 4:
                    squares[i].classList.add('l5')
                    break
            }
        }
    }
    
    function drawRoad(road){
        for (let i =road*width ; i < (road + 1) * width; i++ ){
            squares[i].classList.add('car-left')
        }
        for (let i =(road + 1)*width ; i < (road + 2) * width; i++ ){
            squares[i].classList.add('car-right')
        }
        for (let i = road*width ; i < (road + 2) * width; i++ ){
            switch(i%3){
                case 0:
                    squares[i].classList.add('c1')
                    break
                case 1:
                    squares[i].classList.add('c2')
                    break
                case 2:
                    squares[i].classList.add('c3')
                    break

            }
        }
    }
    
    drawRiver(river1)
    drawRiver(river2)
    drawRiver(river3)
    drawRoad(road1)
    drawRoad(road2)
    drawRoad(road3)
    drawRoad(road4)
    drawRoad(road5)
    const carsLeft = document.querySelectorAll('.car-left')   
    const carsRight = document.querySelectorAll('.car-right')
    const logsLeft = document.querySelectorAll('.log-left')   
    const logsRight = document.querySelectorAll('.log-right')   
//    const squares = document.querySelectorAll('.grid div')
    const scoreDisplay = document.querySelector('.score span')
    const timeLeftDisplay = document.querySelector('.time-left span')
    const startBtn = document.querySelector('.start')
    const up = document.querySelector('.up')
    const left = document.querySelector('.left')
    const right = document.querySelector('.right')
    const down = document.querySelector('.down')
    
    let currentIndex = startIndex
    
    let directon = 1
    let score = 0
    let currentTime = 180
    
    let timerId
    let interval = 0
    let oldDirection = -1850	
    
    
    squares[currentIndex].classList.add('frog')
    
    function moveFrog(e) {
        squares[currentIndex].classList.remove('frog')
        console.log(e.target.id)
        switch(e.keyCode ||
               (e.target.id == 'left'?37:
               (e.target.id == 'up'?38:
               (e.target.id == 'right'?39:
               (e.target.id == 'down'?40:38)))) 
              ){
            case 37 :
                if(currentIndex % width !== 0) currentIndex--
                break
            case 38 :
                if(currentIndex - width >= 0) currentIndex -= width
                break
            case 39 :
                if(currentIndex % width < width - 1) currentIndex++
                break
            case 40 :
                if(currentIndex + width < width * width) currentIndex += width
                break
        }
        squares[currentIndex].classList.add('frog')
        lose()
        win()
    }
    
    /////// move logs
    
    function autoMoveLogs() {
        logsLeft.forEach(logLeft => moveLogLeft(logLeft))
        logsRight.forEach(logRight => moveLogRight(logRight))
    }
    
    function moveLogLeft(logLeft) {
        switch(true) {
            case logLeft.classList.contains('l1'):
                logLeft.classList.remove('l1')
                logLeft.classList.add('l2')
                break
            case logLeft.classList.contains('l2'):
                logLeft.classList.remove('l2')
                logLeft.classList.add('l3')
                break
            case logLeft.classList.contains('l3'):
                logLeft.classList.remove('l3')
                logLeft.classList.add('l4')
                break
            case logLeft.classList.contains('l4'):
                logLeft.classList.remove('l4')
                logLeft.classList.add('l5')
                break
            case logLeft.classList.contains('l5'):
                logLeft.classList.remove('l5')
                logLeft.classList.add('l1')
                break
        }
    }
    function moveLogRight(logRight) {
        switch(true) {
            case logRight.classList.contains('l1'):
                logRight.classList.remove('l1')
                logRight.classList.add('l5')
                break
            case logRight.classList.contains('l2'):
                logRight.classList.remove('l2')
                logRight.classList.add('l1')
                break
            case logRight.classList.contains('l3'):
                logRight.classList.remove('l3')
                logRight.classList.add('l2')
                break
            case logRight.classList.contains('l4'):
                logRight.classList.remove('l4')
                logRight.classList.add('l3')
                break
            case logRight.classList.contains('l5'):
                logRight.classList.remove('l5')
                logRight.classList.add('l4')
                break
        }
    }
    
    
    ///// movecars
    
    function autoMoveCars() {
        carsLeft.forEach(carLeft => moveCarLeft(carLeft))
        carsRight.forEach(carRight => moveCarLeft(carRight))
    }
    
    function moveCarLeft(carLeft) {
        switch(true) {
            case carLeft.classList.contains('c1'):
                carLeft.classList.remove('c1')
                carLeft.classList.add('c2')
                break
            case carLeft.classList.contains('c2'):
                carLeft.classList.remove('c2')
                carLeft.classList.add('c3')
                break
            case carLeft.classList.contains('c3'):
                carLeft.classList.remove('c3')
                carLeft.classList.add('c1')
                break
        }
    }
    function moveCarRight(carRight) {
        switch(true) {
            case carRight.classList.contains('c1'):
                carRight.classList.remove('c1')
                carRight.classList.add('c3')
                break
            case carRight.classList.contains('c2'):
                carRight.classList.remove('c2')
                carRight.classList.add('c1')
                break
            case carRight.classList.contains('c3'):
                carRight.classList.remove('c3')
                carRight.classList.add('c2')
                break
        }
    }
    
    //win and lose
    function win() {
        if (squares[endIndex].classList.contains('frog')){
            scoreDisplay.innerHTML =  " You Won"
            //squares[currentIndex].classList.remove('frog')
            clearInterval(timerId)
            document.removeEventListener('keyup', moveFrog)
            up.removeEventListener('click',moveFrog)
            left.removeEventListener('click', moveFrog)
            right.removeEventListener('click', moveFrog)
            down.removeEventListener('click', moveFrog)
        }
    }
    
    function lose() {
        if ( (currentTime === 0) ||
           (squares[currentIndex].classList.contains('c1')) ||
           (squares[currentIndex].classList.contains('l4')) ||
           (squares[currentIndex].classList.contains('l5')) ){
            scoreDisplay.innerHTML =  " You Lose, try again"
            squares[currentIndex].classList.remove('frog')
            clearInterval(timerId)
            document.removeEventListener('keyup', moveFrog)
            up.removeEventListener('click',moveFrog)
            left.removeEventListener('click', moveFrog)
            right.removeEventListener('click', moveFrog)
            down.removeEventListener('click', moveFrog)
            startGame()
        }
    }
    
    /////// move frog with log moving
    
    function moveWithLogLeft() {
        if(squares[currentIndex].classList.contains('log-left')){
            squares[currentIndex].classList.remove('frog')
            currentIndex--
            squares[currentIndex].classList.add('frog')

        }
    }
    function moveWithLogRight() {
        if(squares[currentIndex].classList.contains('log-right')){
            squares[currentIndex].classList.remove('frog')
            currentIndex++
            squares[currentIndex].classList.add('frog')

        }
    }
    
    /// all auto moves
    function movePeices() {
        currentTime --
        timeLeftDisplay.textContent = currentTime
        autoMoveCars()
        autoMoveLogs()
        moveWithLogLeft()
        moveWithLogRight()
        lose()
    }
    
    
    
    
    function startGame () {
        document.removeEventListener('keyup', moveFrog)
        up.removeEventListener('click',moveFrog)
        left.removeEventListener('click', moveFrog)
        right.removeEventListener('click', moveFrog)
        down.removeEventListener('click', moveFrog)
        
        squares[currentIndex].classList.remove('frog')
        clearInterval(timerId)
        score = 0
        currentTime = 180

        directon = 1
        oldDirection = -1850
        

        currentIndex = startIndex
//        currentSnake.forEach(index => squares[index].classList.add('snake'))
        timerId = setInterval(movePeices, intervalTime)
        squares[currentIndex].classList.add('frog')
        
        document.addEventListener('keyup', moveFrog)
        up.addEventListener('click',moveFrog)
        left.addEventListener('click', moveFrog)
        right.addEventListener('click', moveFrog)
        down.addEventListener('click', moveFrog)
    }
    
    
   
    
    
    
    function control (a){
        
        
        
    }

    //document.addEventListener('keyup', (e) => moveFrog(e.keyCode))
    startBtn.addEventListener('click', () => {
        scoreDisplay.innerHTML = " Game Started"
        startGame()
    })
    

        })
function setDefecalty(r){
    switch(r) { 
        case 0 :  intervalTime = 2000;  break;
        case 1 :  intervalTime = 1000;  break;
        case 2 :  intervalTime = 300;  break;
        default:  intervalTime = 1000;  break;
    }
}
