const cardGame = {
    cards: {
        allCards: document.querySelectorAll('.card'),
        guessedCards: [],
        currentCardToPair : null
    },
    timeItems: {
        timerDefaultValue: 100,
        timerCurrentValue: 100, 
        currentTimeSpan: document.querySelector('[data-timer]')        
    }, 
    flipItems: {
        flipCount: 0,
        canFlip: true,
        currentFlipsSpan: document.querySelector('[data-flips]')
    },
    modals: {
        startModal: document.querySelector('[data-modal-start]'),  
        gameOverModal: document.querySelector('[data-modal-game-over]'),  
        winningModal: document.querySelector('[data-modal-won]')
    },
    buttons: {
        startButton: document.querySelector('[data-button-start]'),
        restartButton: document.querySelector('[data-button-restart]'),
        replayButton: document.querySelector('[data-button-replay]')
    }    
}
const CARDS = cardGame.cards;
const TIME = cardGame.timeItems;
const FLIP = cardGame.flipItems;
const MODALS = cardGame.modals;
const BUTTONS = cardGame.buttons;

CARDS.allCards.forEach(card => {
    card.addEventListener('click',()=> {
        flipCard(card)
    })
})

BUTTONS.startButton.addEventListener('click', () => {
    MODALS.startModal.classList.remove('visible')
    startGame()
})

BUTTONS.restartButton.addEventListener('click', () => {
    MODALS.gameOverModal.classList.remove('visible')
    startGame()
})

BUTTONS.replayButton.addEventListener('click', () => {
    MODALS.winningModal.classList.remove('visible')
    startGame()
})

function resetCardsClasslist() {
    CARDS.allCards.forEach(card => {
        card.classList.remove('visible')
        card.classList.remove('matched')
    })
}

function startGame() {      
    CARDS.guessedCards = []
    TIME.timerCurrentValue = TIME.timerDefaultValue;
    TIME.currentTimeSpan.innerText = TIME.timerCurrentValue;
    CARDS.currentCardToPair = null;
    FLIP.flipCount = 0;
    FLIP.canFlip = true
    const gameTick = setInterval(() => {    
        TIME.timerCurrentValue--;
        TIME.currentTimeSpan.innerText  = TIME.timerCurrentValue
        if(CARDS.guessedCards.length === CARDS.allCards.length){
            clearInterval(gameTick);
            gameWin()
        }
        if(TIME.timerCurrentValue === 0) {
            clearInterval(gameTick);
            gameOver()
        }
    }, 1000);  
    resetCardsClasslist()   

    mixCardArray()
}      

function gameOver(){
    MODALS.gameOverModal.classList.add('visible')
}

function gameWin(){
    MODALS.winningModal.classList.add('visible')
}

function flipCard(card){
    if(!cardCanBeFlipped(card)) return
    
    card.classList.add('visible')  
    FLIP.flipCount++;
    FLIP.currentFlipsSpan.innerText = FLIP.flipCount

    if(CARDS.currentCardToPair) 
        checkForMatch(CARDS.currentCardToPair, card)
    else  
        CARDS.currentCardToPair = card
    
}

function cardCanBeFlipped(card){
    return !card.classList.contains('visible') && !card.classList.contains('matched') && FLIP.canFlip
}

function checkForMatch(card1, card2){
    FLIP.canFlip = false
    setTimeout(()=> { 
        if(getCardType(card1) === getCardType(card2)){ 
            card1.classList.add('matched')
            card2.classList.add('matched')   
            CARDS.guessedCards.push(card1, card2);    
        } else {
            card1.classList.remove('visible')
            card2.classList.remove('visible') 
        } 
        FLIP.canFlip = true
    }, 1000)
    CARDS.currentCardToPair = null
}

function getCardType(card) {
    return card.querySelector('.front-face img').src
}

function mixCardArray(){
    for(let i = CARDS.allCards.length - 1; i > 0; i--){
        let randomIndex = Math.floor(Math.random() * (i + 1))
        CARDS.allCards[randomIndex].style.order = i;
        CARDS.allCards[i].style.order = randomIndex;
    }
}
