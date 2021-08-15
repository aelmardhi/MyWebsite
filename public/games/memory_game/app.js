document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    //  card options 
    const cardArray = [
        {
            name:  'fries',
            img: 'images/fries.png'
        },
        {
            name:  'fries',
            img: 'images/fries.png'
        },
        {
            name:  'cheeseburger',
            img: 'images/cheeseburger.png'
        },
        {
            name:  'cheeseburger',
            img: 'images/cheeseburger.png'
        },
        {
            name:  'hotdog',
            img: 'images/hotdog.png'
        },
        {
            name:  'hotdog',
            img: 'images/hotdog.png'
        },
        {
            name:  'ice-cream',
            img: 'images/ice-cream.png'
        },
        {
            name:  'ice-cream',
            img: 'images/ice-cream.png'
        },
        {
            name:  'milkshake',
            img: 'images/milkshake.png'
        },
        {
            name:  'milkshake',
            img: 'images/milkshake.png'
        },
        {
            name:  'pizza',
            img: 'images/pizza.png'
        },
        {
            name:  'pizza',
            img: 'images/pizza.png'
        },
        {
            name:  'spaghetti',
            img: 'images/spaghetti.png'
        },
        {
            name:  'spaghetti',
            img: 'images/spaghetti.png'
        },
        {
            name:  'chicken',
            img: 'images/chicken.png'
        },
        {
            name:  'chicken',
            img: 'images/chicken.png'
        }
    ]
    
    cardArray.sort(() => 0.5 - Math.random())
        
    const grid = document.querySelector('.grid')
    const resultDisplay = document.querySelector('#result')
    const messager = document.querySelector('#message')
    var cardChosen = []
    var cardCosenId = []
    var cardWon = []
    
    var triesNo = 0

    // create board Game
    function createBoard() {
        for(let i = 0; i < cardArray.length; i++){
            var card = document.createElement('img')
            card.setAttribute('src','images/blank.png')
            card.setAttribute('data-id',i)
            card.setAttribute('class','card')
            card.addEventListener('click', flipCard)
            grid.appendChild(card)
        }
    }
    
    
    //check for matches
    function checkForMatch () {
        triesNo++
        var cards = document.querySelectorAll('img')
        const optionOneId = cardCosenId[0]
        const optionTwoId = cardCosenId[1]
        if (cardChosen[0] === cardChosen[1]){
            messager.textContent='you found a match'
            messager.setAttribute('style','color:#23a;')
            cards[optionOneId].setAttribute('src','images/white.png')
            cards[optionTwoId].setAttribute('src','images/white.png')
            cardWon.push(cardChosen[0])
        } else {
            cards[optionOneId].setAttribute('src','images/blank.png')
            cards[optionTwoId].setAttribute('src','images/blank.png')
            messager.setAttribute('style','color:#F44;')
            messager.textContent= 'Sorry, try again'
        }
        cardChosen = []
        cardCosenId = []
        resultDisplay.textContent = cardWon.length*100-triesNo*20
        if (cardWon.length === cardArray.length/2){
            messager.textContent = 'Congratulations! You found all of them'
            document.body.classList.add('won')
//            var ele = document.createElement('h1')
//            ele.textContent='Congratulations! You found all of them'
//            ele.setAttribute('class','won')
//            cardStyle.setAttribute('style','display:none')
//            grid.appendChild(ele)
        }
    }
    
    //flip your card
    function flipCard(){
        var cardId = this.getAttribute('data-id')
        if(!cardWon.includes(cardArray[cardId].name)&&!cardCosenId.includes(cardId)){
//            console.log(cardWon)
            cardChosen.push(cardArray[cardId].name)
            cardCosenId.push(cardId)
            this.setAttribute('src',cardArray[cardId].img)
            if (cardChosen.length === 2){
                setTimeout(checkForMatch,500)
            }
        }
    }
    
    document.getElementById('reload').addEventListener('click',() => {
        cardChosen = []
        cardCosenId = []
        cardWon =[]
        triesNo = 0
        resultDisplay.textContent = 0
        messager.textContent= '-'
        document.body.classList.remove('won')
        var cards = document.querySelectorAll('img')
        cardArray.sort(() => 0.5 - Math.random())
        for (let i = 0; i < cards.length;i++){
            cards[i].setAttribute('src','images/blank.png')
        }
    })
    
    createBoard()
});



