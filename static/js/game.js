function fillDeck() {
    let deck = [];
    let suits = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];
    let values = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'];

    for (let suit of suits) {
        for (let value of values) {

            //etc
            let card = {suit: suit, value: value, image: `${value}_of_${suit}.png`};
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

function dealCard(deck){
    let playerDeck = [];
    let pickedCard = deck.pop();

    playerDeck.push(pickedCard);
    return playerDeck;
}

function game(){
    let deck = fillDeck();
    shuffle(deck);
    let card = dealCard(deck);
    console.log(card);
}

game();
