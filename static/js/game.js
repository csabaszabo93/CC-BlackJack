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
    let playerHand = document.querySelectorAll(divClass);
    for (let i = 0; i < hand.length; i++){
            let image = hand[i].image;
            playerHand[i].innerHTML = `<img src="/static/img/cards/${image}" height="120"/>`;
            playerHand[i].style.zIndex = `${i}`;
    }
}


function dealerHand(hand){
    let dealerHand = document.querySelectorAll('.dealer-card');
    for (let i = 0; i < hand.length; i++){
        if (i !== 1){
            let image = hand[i].image;
            dealerHand[i].innerHTML = `<img src="/static/img/cards/${image}" height="120"/>`;
        } else {
            dealerHand[i].innerHTML = `<img src="/static/img/cards/cardback.png" height="120"/>`;
        }
        dealerHand[i].style.zIndex = `${i}`;
        dealerHand[i].style.marginLeft = `${i * 2.5}%`;
    }
}


function checkValue(cards){
    let values = [];
    for (card of cards){
        if (card.value === 'Ace'){
            values.push(11);
        }
        else if (typeof card.value === 'string'){ // ace is considered a 10, needs to be a sep. condition.
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
            alert("Natural Win - Fatality!");
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
    showHand(playerCards, '.player-card');
    dealerHand(dealerCards);

    if (checkNatural(dealerCards)){
        showHand(dealerCards, '.dealer-card');
    }
    if (checkNatural(playerCards)){
        showHand(dealerCards, '.dealer-card');
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
    showHand(hand, '.player-card');
    //BUST
    checkBust(hand);
}

function checkBust(hand){
    hand = JSON.parse(sessionStorage.getItem("hand"));
    let value = checkValue(hand);
    if(value > 21){
        setTimeout(function() { alert("Busted"); }, 150);
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

    showHand(dealerCards, '.dealer-card');
    evaluateHands(playerCards, dealerCards);

}

function evaluateHands(playerHand, dealerHand){
    let playerValue = checkValue(playerHand);
    let dealerValue =  checkValue(dealerHand);
    if (playerValue > 21){
        setTimeout(function() { alert("Busted"); }, 150);
    } else if (dealerValue > 21 || playerValue > dealerValue) {
        setTimeout(function () {alert("Player Wins");}, 150);
    } else if (playerValue === dealerValue) {
        setTimeout(function () { alert("Draw!"); }, 150);
    } else { setTimeout(function () { alert("Player Died"); }, 150);}
}

game();
