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

function countValue(hand){
    value = 0;
    for(card of hand){
        value += card.point;
    }
    return value;
}

function checkNatural(hand, player) {
    let chips = parseInt(localStorage.getItem("chips"));
    let value = checkValue(hand);
    if (value === 21) {
        if (player === true){
            chips += (parseInt(localStorage.getItem('bet'))*2); // chips awarded for Natural only if player has it
            localStorage.setItem("chips", chips);
            setTimeout(function () {alert('Player Natural Win - Fatality!'); location.reload();}, 150)
        } else {
            setTimeout(function () {
                alert("Computer Natural Win - Fatality!");
                location.reload();
            }, 150);
        }
        return true;
    }
    return false;
}

function game(){

    let chips = parseInt(handleChips());
    document.getElementById('chips').innerHTML = chips;

    let bet = getBet(chips);
    console.log(bet);
    localStorage.setItem("bet", bet);

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
    showHand(playerCards, '.player-card');
    dealerHand(dealerCards);

    checkBust(playerCards);

    if (checkNatural(dealerCards, false)){
        showHand(dealerCards, '.dealer-card');
    }
    if (checkNatural(playerCards, true)){
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
    let chips = parseInt(localStorage.getItem("chips")); // player's money from local storage
    hand = JSON.parse(sessionStorage.getItem("hand"));
    let value = checkValue(hand);
    let playerHasAce = checkHandForAce(hand);
    if(value > 21 && !playerHasAce){
        chips -= parseInt(localStorage.getItem('bet')); // player is losing money.
        localStorage.setItem("chips", chips); // chips stored in localStorage
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

    showHand(dealerCards, '.dealer-card');
    evaluateHands(playerCards, dealerCards);

}

function surrender(event){
    let chips = parseInt(localStorage.getItem("chips"));
    chips -= parseInt(localStorage.getItem('bet'));
    localStorage.setItem("chips", chips);
    location.reload();
}

function evaluateHands(playerHand, dealerHand){
    let chips = parseInt(localStorage.getItem("chips"));
    let playerValue = countValue(playerHand);
    let dealerValue =  countValue(dealerHand);
    if (playerValue > 21){
        setTimeout(function() { alert("Busted"); location.reload(); }, 150);
    } else if (dealerValue > 21 || playerValue > dealerValue) {
        chips += parseInt(localStorage.getItem('bet'));
        localStorage.setItem("chips", chips);
        setTimeout(function () {alert(`"Computer: ${dealerValue} || Player: ${playerValue} - Player Wins"`); location.reload();}, 150);
    } else if (playerValue === dealerValue) {
        setTimeout(function () { alert("Draw!"); location.reload();}, 150);
    } else {
        chips -= parseInt(localStorage.getItem('bet'));
        localStorage.setItem("chips", chips);
        setTimeout(function () { alert(`"Computer: ${dealerValue} || Player: ${playerValue} - Player Died"`); location.reload(); }, 150); }
}


function handleChips(){ // handles the amount of chips the player has. Initially gets them out of the data server.py sends, after that uses localStorage
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

function getBet(chips){ // player is prompted to enter a number to bet. Still need to handle a case if the bet is > than the money the player has.

    do{
        bet = prompt('How much do you want to bet? You have ' + `${chips}` + ' $ on your hand.');
    } while(bet == null || bet === "" || bet > chips );

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
