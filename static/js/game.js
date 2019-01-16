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
    console.log(card.image);
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
        } else if (typeof card.value === 'string'){
            values.push(10);
        } else {
            values.push(card.value);
        }
    }
    return values.reduce((a, b) => a + b, 0)
}


function checkNatural(hand) {
    let chips = parseInt(localStorage.getItem("chips"));
    let value = checkValue(hand);
    if (value === 21) {
        setTimeout(function () {
            chips += 15;
            localStorage.setItem("chips", chips);
            alert("Natural Win - Fatality!"); location.reload();
        }, 150);
        return true;
    }
    return false;
}

function game(){
    let chips = parseInt(handleChips());
    console.log(chips);
    document.getElementById('chips').innerHTML = chips;
    let hitButton = document.getElementById('btn-hit');

    hitButton.addEventListener("click", function(event){
        deck = JSON.parse(sessionStorage.getItem("deck"));
        hand = JSON.parse(sessionStorage.getItem("hand"));
        dealCard(deck,hand);
        sessionStorage["hand"] = JSON.stringify(hand);
        hand = JSON.parse(sessionStorage.getItem("hand"));
        showHand(hand, '.player-card');
        checkBust(hand, chips);
    });

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
    showHand(playerCards, '.player-card');
    dealerHand(dealerCards);

    checkBust(playerCards, chips);

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
    showHand(hand, '.player-card');
    checkBust(hand);
}

function checkBust(hand) { // check if player has 2 Aces at the beginning and bust them
    let chips = parseInt(localStorage.getItem("chips"));
    hand = JSON.parse(sessionStorage.getItem("hand"));
    let value = checkValue(hand);
    if(value > 21){
        chips -= 10;
        localStorage.setItem("chips", chips);
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

    showHand(dealerCards, '.dealer-card');
    evaluateHands(playerCards, dealerCards);

}

function surrender(event){
    let chips = parseInt(localStorage.getItem("chips"));
    chips -= 10;
    localStorage.setItem("chips", chips);
    location.reload();
}

function evaluateHands(playerHand, dealerHand){
    let chips = parseInt(localStorage.getItem("chips"));
    let playerValue = checkValue(playerHand);
    let dealerValue =  checkValue(dealerHand);
    if (playerValue > 21){
        setTimeout(function() { alert("Busted"); location.reload(); }, 150);
    } else if (dealerValue > 21 || playerValue > dealerValue) {
        chips += 10;
        localStorage.setItem("chips", chips);
        setTimeout(function () {alert(`"Computer: ${dealerValue} || Player: ${playerValue} - Player Wins"`); location.reload();}, 150);
    } else if (playerValue === dealerValue) {
        setTimeout(function () { alert("Draw!"); location.reload();}, 150);
    } else {
        chips -= 10;
        localStorage.setItem("chips", chips);
        setTimeout(function () { alert(`"Computer: ${dealerValue} || Player: ${playerValue} - Player Died"`); location.reload(); }, 150); }
}


function handleChips(){
    if (!localStorage.getItem('chips')){
        let chips = document.getElementById('chips');
        localStorage.setItem("chips", chips.dataset.amount);
    } else {
        let chips = parseInt(localStorage.getItem("chips"));
        if (chips <= 0) {
            let answer = confirm("You have lost all your money. Would you like to take a 100$ loan??");
            if (answer){
                localStorage.setItem("chips", 100);
            } else {
                localStorage.removeItem('chips');
                window.location.href='/';
            }
        }
    }
    return localStorage.getItem("chips");
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

game()