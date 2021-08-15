
let intervalTime = 1000

document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const width = 30;
    let squares = []
    const grid = document.querySelector('.grid')
    for (let i =0 ; i < width * width; i++ ){
        let ele = document.createElement('div')
        grid.appendChild(ele)
        squares.push(ele)
    }
         
         
//    const squares = document.querySelectorAll('.grid div')
    const resultDisplay = document.querySelector('#result')
    const startBtn = document.querySelector('.start')
//    const up = document.querySelector('.up')
    const left = document.querySelector('.left')
    const right = document.querySelector('.right')
    const shootBtn = document.querySelector('.shoot')
//    const down = document.querySelector('.down')
    
   
    let direction = 1
    let result = 0
    
    let currentShooterIndex = 855
    let currentInvaderIndex = 0
    let alienInvadersTakenDown = []
    let invderId
    
    const alienInvaders = [
        3,4,23,
        30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,54,
        60,61,62,63,64,65,66,67,68,69,81,84,
        96,97,100,101,104,105,108,109,112,113,114,
        125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,
        154,155,156,157,170,171,172,173,174,
    ]
    
    function startGame() {
        squares[currentShooterIndex].classList.remove('shooter')
        for (let i = 0 ; i< alienInvaders.length; i++){
            squares[currentInvaderIndex+alienInvaders[i]].classList.remove('invader')
        }
        currentShooterIndex= 855
        direction = 1
        result = 0
        resultDisplay.textContent= result
        currentInvaderIndex = 0
        alienInvadersTakenDown = []
        clearInterval(invderId)
        invderId = setInterval(moveInvders,intervalTime)
        alienInvaders.forEach ( invader => squares[currentInvaderIndex + invader].classList.add('invader'))
    
        squares[currentShooterIndex].classList.remove('boom')
        squares[currentShooterIndex].classList.add('shooter')
    }
   
    alienInvaders.forEach ( invader => squares[currentInvaderIndex + invader].classList.add('invader'))
    
    squares[currentShooterIndex].classList.add('shooter')
    
    function moveShooter(a) {
        squares[currentShooterIndex].classList.remove('shooter')
        switch (a){
            case 37 :
                if (currentShooterIndex % width !== 0) currentShooterIndex--
                break
            case 39:
                if(currentShooterIndex % width !== width-1) currentShooterIndex++
                break
        }
        squares[currentShooterIndex].classList.add('shooter')
        
    }
    
    function moveInvders() {
        const leftEdge = (currentInvaderIndex) % width === 0
        const rightEdge = (currentInvaderIndex+alienInvaders[alienInvaders.length-1]) % width === width -1
        
        if ( (leftEdge && direction === -1 )||(rightEdge && direction === 1)){
            direction = width
        }else {
            if (leftEdge) direction=1
            else if (rightEdge) direction = -1
        }
        for (let i = 0 ; i< alienInvaders.length; i++){
            squares[currentInvaderIndex+alienInvaders[i]].classList.remove('invader')
        }
        //for (let i = 0 ; i< alienInvaders.length; i++){
            currentInvaderIndex += direction
        
        for (let i = 0 ; i< alienInvaders.length; i++){
            if(!alienInvadersTakenDown.includes(i)){
                squares[currentInvaderIndex+alienInvaders[i]].classList.add('invader')
            }
        }
        
        if(squares[currentShooterIndex].classList.contains('invader', 'shooter')){
            resultDisplay.textContent = result +  'Game Over'
            squares[currentShooterIndex].classList.add('boom')
            clearInterval(invderId)
        }
        for (let i = 0 ; i< alienInvaders.length; i++){
            if((alienInvaders[i]+currentInvaderIndex) > (squares.length - width - 1)){
                resultDisplay.textContent = result +  'Game Over'
                clearInterval(invderId)
            }
        }
        
        if(alienInvadersTakenDown.length === alienInvaders.length){
            resultDisplay.textContent = result + 'You Won'
        }
    }
    
    
    invderId = setInterval(moveInvders,intervalTime)
    
    
    function shoot(a) {
        let laserId 
        let currentLaserIndex = currentShooterIndex
        
        function moveLaser(){
            squares[currentLaserIndex].classList.remove('laser')
            currentLaserIndex -= width
            
            if(squares[currentLaserIndex].classList.contains('invader')){
//                squares[currentLaserIndex].classList.remove('laser')
                squares[currentLaserIndex].classList.remove('invader')
                squares[currentLaserIndex].classList.add('boom')
                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'),250) 
                clearInterval(laserId)
                
                
                const alienTakenDown = alienInvaders.indexOf(currentLaserIndex-currentInvaderIndex)
                alienInvadersTakenDown.push(alienTakenDown)
                result++
                resultDisplay.textContent = result
                
            }else
            squares[currentLaserIndex].classList.add('laser')
            if (currentLaserIndex < width){
                clearInterval(laserId)
                setTimeout(() => squares[currentLaserIndex].classList.remove('laser'),100) 
            }
        }
        
            switch(a){
                case 32:
                    laserId = setInterval(moveLaser,100)
                    //setTimeout(() => clearInterval(laserId),1000)
                    break
            }
      
        
    }
    
       
    //document.addEventListener('keydown', (e) => moveShooter(e.keyCode))
    document.addEventListener('keyup', (e) =>shoot(e.keyCode))
    document.addEventListener('keydown', (e) => {
            switch(e.keyCode){
//                case 32:
//                    shoot(e)
//                    break
                case 37:
                case 39:
                    moveShooter(e.keyCode)
                    break
                    
            }
                              })
    
    //startBtn.addEventListener('click', startGame)
//    up.addEventListener('click',(e) => control(38))
    left.addEventListener('click',(e) => moveShooter(37))
    right.addEventListener('click',(e) => moveShooter(39))
    shootBtn.addEventListener('click', () => shoot(32))
//    down.addEventListener('click',(e) => control(40))
    startBtn.onclick = startGame
    document.getElementById('easy').onclick = () => {
        intervalTime = 1000
        startGame()
    }
    document.getElementById('medium').onclick = () => {
        intervalTime = 500
        startGame()
    }
    document.getElementById('hard').onclick = () => {
        intervalTime = 200
        startGame()
    }

        })
function setDefecalty(r){
    switch(r) { 
        case 0 :  intervalTime = 1000;   break;
        case 1 :  intervalTime = 500;  break;
        case 2 :  intervalTime = 300;  break;
        default:  intervalTime = 1000;  break;
    }
}
