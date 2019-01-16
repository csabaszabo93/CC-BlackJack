function fillDeck() {
    let deck = [];
    let suits = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];
    let values = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'];

    for (let suit of suits) {
        for (let value of values) {
            let card = {suit: suit, value: value, image: `${value}_of_${suit}.png`.toLowerCase()};
            for (let i = 0; i < 6; i++) {
                deck.push(card);
            }
        }
    }

    return deck;
}


function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function dealCard(deck, hand){
    let card = deck.pop();
    sessionStorage.setItem("deck", JSON.stringify(deck));
    hand.push(card);
}


function showHand(hand, divClass){
    let deck;
    let parity;
    let midIndex = Math.floor(hand.length / 2);
    let startIndex = midIndex;
    if (hand.length / 2 === midIndex) {
        parity = 'even';
    } else {
        parity = 'odd';
    }
    switch (divClass) {
        case 'player-card':
            deck = document.getElementById('player-deck');
            break;
        case 'dealer-card':
            deck = document.getElementById('dealer-deck');
            break;
    }
    while (deck.firstChild) {
        deck.removeChild(deck.firstChild);
    }
    for (let i = 0; i < hand.length; i++){
            let card = document.createElement('div');
            let cardFront = document.createElement('div');
            let cardBack = document.createElement('div');
            let flipper = document.createElement('div');
            let cardImage = document.createElement('img');
            let backImage = document.createElement('img');
            card.classList.add(divClass);
            card.classList.add('slot');
            card.classList.add('hidden');
            if (i === midIndex && parity === 'odd') {
                card.classList.add(`${parity}-0`);
            } else {
                if (i < midIndex) {
                    card.classList.add(`${parity}-l${startIndex}`);
                    startIndex > 1 ? startIndex-- : null;
                } else {
                    card.classList.add(`${parity}-r${startIndex}`);
                    startIndex++;
                }
            }
            card.setAttribute('id', `${divClass}-${i}`);
            backImage.setAttribute('src', `/static/img/cards/cardback.png`);
            cardFront.classList.add('front');
            cardBack.classList.add('back');
            card.appendChild(cardBack);
            card.appendChild(cardFront);
            let imageURL = hand[i].image;
            cardImage.setAttribute('src', `/static/img/cards/${imageURL}`);
            if (divClass === 'dealer-card' && i === 1) {
                cardFront.appendChild(backImage);
                cardBack.appendChild(cardImage);
            } else {
                cardFront.appendChild(cardImage);
                cardBack.appendChild(backImage);
            }
            deck.appendChild(card);
    }
}


function dealerHand(hand){
    showHand(hand, 'dealer-card');
}


function checkValue(cards){
    let values = [];
    for (card of cards){
        if (card.value === 'Ace'){
            values.push(11);
        } else if (typeof card.value === 'string'){
            values.push(10);
        } else {
            values.push(card.value);
        }
    }
    return values.reduce((a, b) => a + b, 0)
}


function checkNatural(hand) {
    let value = checkValue(hand);
    if (value === 21) {
        setTimeout(function () {
            alert("Natural Win - Fatality!"); location.reload();
        }, 150);
        return true;
    }
    return false;
}

function game(){
    let hitButton = document.getElementById('btn-hit');
    hitButton.addEventListener("click", hit);
    let standButton = document.getElementById('btn-stand');
    standButton.addEventListener("click", stand);
    let surrenderButton = document.getElementById('btn-surrender');
    surrenderButton.addEventListener("click", surrender);
    let playerCards = [];
    let dealerCards = [];
    let initDeck = fillDeck(); // fills deck with 312 cards
    shuffle(initDeck); // shuffles the deck
    let deck = initDeck.slice(0, 250); // using only the top 250 cards
    sessionStorage.setItem("hand", JSON.stringify(playerCards));
    for (let i=0; i < 2; i++){
        dealCard(deck, playerCards);
        dealCard(deck, dealerCards);
    }
    sessionStorage["hand"] = JSON.stringify(playerCards);
    sessionStorage["dealerHand"] = JSON.stringify(dealerCards);
    showHand(playerCards, 'player-card');
    dealerHand(dealerCards);

    checkBust(playerCards);

    if (checkNatural(dealerCards)){
        showHand(dealerCards, 'dealer-card');
    }
    if (checkNatural(playerCards)){
        showHand(dealerCards, 'dealer-card');
    }

    sessionStorage.setItem("deck", JSON.stringify(deck));
}

function hit(event){
    deck = JSON.parse(sessionStorage.getItem("deck"));
    hand = JSON.parse(sessionStorage.getItem("hand"));
    dealCard(deck,hand);
    sessionStorage["hand"] = JSON.stringify(hand);
    hand = JSON.parse(sessionStorage.getItem("hand"));
    console.log(hand);
    showHand(hand, 'player-card');
    checkBust(hand);
}

function checkBust(hand){ // check if player has 2 Aces at the beginning and bust them
    hand = JSON.parse(sessionStorage.getItem("hand"));
    let value = checkValue(hand);
    if(value > 21){
        setTimeout(function() { alert("Busted"); location.reload();}, 150);
    }
}

function stand(event){
    deck = JSON.parse(sessionStorage.getItem("deck"));
    playerCards = dealerCards = JSON.parse(sessionStorage.getItem("hand"));
    dealerCards = JSON.parse(sessionStorage.getItem("dealerHand"));

    while (checkValue(dealerCards) < 17) {
        dealCard(deck, dealerCards);
        dealerHand(dealerCards, 3);
    }

    showHand(dealerCards, 'dealer-card');
    evaluateHands(playerCards, dealerCards);

}

function surrender(event){
    location.reload();
}

function evaluateHands(playerHand, dealerHand){
    let playerValue = checkValue(playerHand);
    let dealerValue =  checkValue(dealerHand);
    if (playerValue > 21){
        setTimeout(function() { alert("Busted"); location.reload(); }, 150);
    } else if (dealerValue > 21 || playerValue > dealerValue) {
        setTimeout(function () {alert(`"Computer: ${dealerValue} || Player: ${playerValue} - Player Wins"`); location.reload();}, 150);
    } else if (playerValue === dealerValue) {
        setTimeout(function () { alert("Draw!"); location.reload();}, 150);
    } else { setTimeout(function () { alert(`"Computer: ${dealerValue} || Player: ${playerValue} - Player Died"`); location.reload(); }, 150); }
}


document.body.onkeyup = function(a){
    if (a.keyCode === 32){
        stand()
    } else if (a.keyCode === 13){
        hit()
    } else if (a.keyCode === 27){
        surrender()
    }
};


game();
