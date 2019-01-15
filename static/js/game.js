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
    return a.slice(0, 250);
}


function dealCard(deck, hand){
    let card = deck.pop();
    hand.push(card);
}


function showHand(hand){
    let userCards = document.getElementById('player-deck');
    let playerHand = document.querySelectorAll('.player-card');
    for (let i = 0; i < 5; i++){
            let image = hand[i].image;
            playerHand[i].innerHTML = `<img src="/static/img/cards/${image}" height="350"/>`;
            playerHand[i].style.zIndex = `${i}`;
            playerHand[i].style.marginLeft = `${i * 2.5}%`;
    }
}


function game(){
    let hand = [];
    let initDeck = fillDeck(); // fills deck with 312 cards
    shuffle(initDeck); // shuffles the deck
    let deck = initDeck.slice(0, 250); // using only the top 250 cards
    console.log(deck);
    for (let i=0; i < 5; i++){
        dealCard(deck, hand);
    }
    showHand(hand);
}


game();
