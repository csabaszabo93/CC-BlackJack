function fillDeck() {
    let deck = [];
    let suits = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];
    let values = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'];

    for (let suit of suits) {
        for (let value of values) {

            //etc
            let card = {suit: suit, value: value, image: `${value}_of_${suit}.png`.toLowerCase()};
            for (let i = 0; i < 1; i++) {
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
}


function showHand(hand){
    let userCards = document.getElementById('player-deck');
    let playerHand = document.querySelectorAll('.player-card');
    for (let i = 0; i < playerHand.length; i++){
            let image = hand[i].image;
            playerHand[i].innerHTML = `'<img src="/static/img/cards/${image}" height="350"/>'`;
    }
}


function game(){
    let hand = [];
    let deck = fillDeck();
    shuffle(deck);
    for (let i=0; i < 2; i++){
        dealCard(deck, hand);
    }
    showHand(hand);
}

game();
