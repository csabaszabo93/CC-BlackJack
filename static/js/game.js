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
    hand.push(card);
    sessionStorage["deck"] = JSON.stringify(deck);
    sessionStorage["hand"] = JSON.stringify(hand);
}


function showHand(hand, handSize){
    let playerHand = document.querySelectorAll('.player-card');
    for (let i = 0; i < 2; i++){
            let image = hand[i].image;
            playerHand[i].innerHTML = `<img src="/static/img/cards/${image}" height="120"/>`;
            playerHand[i].style.zIndex = `${i}`;
            playerHand[i].style.marginLeft = `${i * 2.5}%`;
    }
}


function dealerHand(hand, handSize){
    let dealerHand = document.querySelectorAll('.dealer-card');
    for (let i = 0; i < handSize; i++){
        if (i !== 1){
            let image = hand[i].image;
            dealerHand[i].innerHTML = `<img src="/static/img/cards/${image}" height="120"/>`;
        } else {
            dealerHand[i].innerHTML = `<img src="/static/img/cards/red_joker.png" height="120"/>`;
        }
        dealerHand[i].style.zIndex = `${i}`;
        dealerHand[i].style.marginLeft = `${i * 2.5}%`;
    }
}


function checkValue(cards){
    let values = [];
    for (card of cards){
        if (typeof card.value === 'string'){ // ace is considered a 10, needs to be a sep. condition.
            values.push(10);
        } else {
            values.push(card.value);
        }
    }
    return values.reduce((a, b) => a + b, 0)
}

function game(){
    let hitButton = document.getElementById('btn-hit');
    hitButton.addEventListener("click", hit);
    let playerCards = [];
    let dealerCards = [];
    let initDeck = fillDeck(); // fills deck with 312 cards
    shuffle(initDeck); // shuffles the deck
    let deck = initDeck.slice(0, 250); // using only the top 250 cards
    sessionStorage.setItem("deck", JSON.stringify(deck));  // put deck into localStorage
    sessionStorage.setItem("hand",JSON.stringify(playerCards));
    for (let i=0; i < 2; i++){
        dealCard(deck, playerCards);
        dealCard(deck, dealerCards);
    }
    showHand(playerCards);
    dealerHand(dealerCards, 2);
    console.log(dealerCards);

    let dealerValue = checkValue(dealerCards);

    if (dealerValue < 17){
        dealCard(deck, dealerCards);
        dealerHand(dealerCards, 3);
    }
}

function hit(event){
    deck = JSON.parse(sessionStorage.getItem("deck"))
    hand = JSON.parse(sessionStorage.getItem("hand"));
    dealCard(deck,hand);
    showHand(hand);
}


game();
