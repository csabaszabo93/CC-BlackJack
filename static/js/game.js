function fillDeck() {
    let deck = [];
    let suits = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];
    let values = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'];

    for (let suit of suits) {
        let point = 0;
        for (let value of values) {
            if (value === 'Ace'){
                point = 11;
            } else if (typeof value === 'string'){
                point = 10;
            } else {
                point = value;
            }
            let card = {suit: suit, value: value, point:point, image: `${value}_of_${suit}.png`.toLowerCase()};
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
            let cardImage = document.createElement('img');
            let backImage = document.createElement('img');
            card.classList.add(divClass);
            card.classList.add('slot');
            if (hand.length === 2 || i > hand.length - 2) {
                card.classList.add('hidden');
            } else {
                cardFront.classList.add('flipped-card');
                cardBack.classList.add('flipped-card');
            }
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

function countValue(hand){
    value = 0;
    for(card of hand){
        value += card.point;
    }
    return value;
}

function checkNatural(hand, player) {
    let chips = parseInt(sessionStorage.getItem("chips"));
    let value = countValue(hand);
    if (value === 21) {
        if (player === true){
            chips += (parseInt(sessionStorage.getItem('bet'))*1.5); // chips awarded for Natural only if player has it
            sessionStorage.setItem("chips", chips);
            setTimeout(function () {alert('Player Natural Win - Fatality!'); location.reload();}, 500)
        } else {
            setTimeout(function () {
                chips -= (parseInt(sessionStorage.getItem('bet'))); // chips awarded for Natural only if player has it
                sessionStorage.setItem("chips", chips);
                alert("Computer Natural Win - Fatality!");
                location.reload();
            }, 500);
        }
        return true;
    }
    return false;
}

function game(){

    sessionStorage.setItem('double', true);

    let chips = parseInt(handleChips());
    document.getElementById('chips').innerHTML = chips;

    let bet = getBet(chips);
    sessionStorage.setItem("bet", bet);
    document.getElementById('bet').innerHTML = bet;

    let hitButton = document.getElementById('btn-hit');
    hitButton.addEventListener("click", hit);

    let standButton = document.getElementById('btn-stand');
    standButton.addEventListener("click", stand);

    let surrenderButton = document.getElementById('btn-surrender');
    surrenderButton.addEventListener("click", surrender);

    let doubleButton = document.getElementById('btn-double');
    doubleButton.addEventListener("click", double);

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

    if (checkNatural(dealerCards, false)){
        showHand(dealerCards, 'dealer-card');
    }
    if (checkNatural(playerCards, true)){
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
    showHand(hand, 'player-card');
    let midIndex = Math.floor(hand.length / 2);
    let parity;
    if (hand.length / 2 === midIndex) {
        parity = 'even';
    } else {
        parity = 'odd';
    }
    dealCardTo(`${parity}-r${midIndex}`, 'player');
    checkBust(hand);
}

function checkBust(hand) { // check if player has 2 Aces at the beginning and bust them
    let chips = parseInt(sessionStorage.getItem("chips")); // player's money from local storage
    hand = JSON.parse(sessionStorage.getItem("hand"));
    let value = countValue(hand);
    let playerHasAce = checkHandForAce(hand);
    if(value > 21 && !playerHasAce){
        chips -= parseInt(sessionStorage.getItem('bet')); // player is losing money.
        sessionStorage.setItem("chips", chips); // chips stored in sessionStorage
        setTimeout(function() { alert("Busted"); location.reload();}, 150);
    }
    else if(value > 21 && playerHasAce){
        reduceAceInHand(hand);
        hand = JSON.parse(sessionStorage.getItem("hand"));
        checkBust(hand);
    }
}


function checkHandForAce(hand){
    let playerHasAce = false;
    for(card of hand){
        if(card.value == 'Ace' && card.point == 11){
            return true;
        }
    }

    return playerHasAce;

}
function reduceAceInHand(hand){
    for(card of hand){
        if(card.value == 'Ace' && card.point == 11){
            card.point = 1;
            break;
        }
    }
    sessionStorage.setItem("hand", JSON.stringify(hand));
    return hand;
}

function stand(event){
    deck = JSON.parse(sessionStorage.getItem("deck"));
    playerCards = dealerCards = JSON.parse(sessionStorage.getItem("hand"));
    dealerCards = JSON.parse(sessionStorage.getItem("dealerHand"));

    while (countValue(dealerCards) < 17) {
        dealCard(deck, dealerCards);
        dealerHand(dealerCards, 3);
    }

    showHand(dealerCards, 'dealer-card');
    evaluateHands(playerCards, dealerCards);

}

function surrender(event){
    let chips = parseInt(sessionStorage.getItem("chips"));
    chips -= parseInt(sessionStorage.getItem('bet'));
    sessionStorage.setItem("chips", chips);
    location.reload();
}

function double(event){

    let handValue = countValue(JSON.parse(sessionStorage.getItem("hand")));
    if (handValue > 8 && handValue < 12 && sessionStorage.getItem('double') === 'true'){
        let bet = parseInt(sessionStorage.getItem('bet'));
        if (sessionStorage.getItem('chips') >= bet*2){
            let double = bet*2;
            sessionStorage.setItem("bet", double);
            sessionStorage.setItem('double', false);
            document.getElementById('bet').innerHTML = double;
        } else {}
    }
}

function evaluateHands(playerHand, dealerHand){
    let chips = parseInt(sessionStorage.getItem("chips"));
    let playerValue = countValue(playerHand);
    let dealerValue =  countValue(dealerHand);
    if (playerValue > 21){
        setTimeout(function() { alert("Busted"); location.reload(); }, 150);
    } else if (dealerValue > 21 || playerValue > dealerValue) {
        chips += parseInt(sessionStorage.getItem('bet'));
        sessionStorage.setItem("chips", chips);
        setTimeout(function () {alert(`"Computer: ${dealerValue} || Player: ${playerValue} - Player Wins"`); location.reload();}, 150);
    } else if (playerValue === dealerValue) {
        setTimeout(function () { alert("Draw!"); location.reload();}, 150);
    } else {
        chips -= parseInt(sessionStorage.getItem('bet'));
        sessionStorage.setItem("chips", chips);
        setTimeout(function () { alert(`"Computer: ${dealerValue} || Player: ${playerValue} - Player Died"`); location.reload(); }, 150); }
}


function handleChips(){ // handles the amount of chips the player has. Initially gets them out of the data server.py sends, after that uses sessionStorage
    if (!sessionStorage.getItem('chips')){
        let chips = document.getElementById('chips');
        sessionStorage.setItem("chips", chips.dataset.amount);
    } else {
        let chips = parseInt(sessionStorage.getItem("chips"));
        if (chips <= 0) {
            let answer = confirm("You have lost all your money. Would you like to take a 100$ loan??");
            if (answer){
                sessionStorage.setItem("chips", 100);
            } else {
                window.location.href='/';
                sessionStorage.removeItem('chips');
            }
        }
    }
    return sessionStorage.getItem("chips");
}

function getBet(chips){ // player is prompted to enter a number to bet. Still need to handle a case if the bet is > than the money the player has.
    if (isNaN(chips)){
    } else {
        do{
            bet = prompt('How much do you want to bet? You have ' + `${chips}` + ' $ on your hand.');
        } while(bet == null || bet === "" || bet > chips );
    }

    return bet;
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
