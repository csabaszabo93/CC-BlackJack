setDesign();
function setDesign() {
    let cards = document.querySelectorAll('.my-card');
    let leftMargin = 0;
    for (let i = 0; i < cards.length; i++) {
        // cards[i].classList.add('hidden');
        if (i !== 0 && i !== 5) {
            cards[i].style.zIndex = `${i}`;
            cards[i].style.marginLeft = `${leftMargin}%`;
        }
    }
    window.onload = function () {
        dealCardTo("even-l1", "player");
        setTimeout(function() {
            dealCardTo("even-r1", "player");
        }, 4000);
        setTimeout(function() {
            dealCardTo("even-l1", "dealer");
        }, 8000);
        setTimeout(function() {
            dealCardTo("even-r1", "dealer");
        }, 12000);
    };
}
function dealCardTo(slot, who) {
    let card = document.getElementById(`main-deck-${who}`);
    card.addEventListener('transitionend', function() {
        goBack(card, slot, who);
    });
    card.classList.remove("hidden");
    card.classList.add(`deal-${who}-card`);
    card.classList.add(slot);
}
function goBack(animatedCard, slot, from) {
    let deck = document.getElementById(`${from}-deck`);
    let newCard = deck.getElementsByClassName(slot)[0];
    let back = newCard.getElementsByClassName('back')[0];
    let front = newCard.getElementsByClassName('front')[0];
    newCard.classList.remove("hidden");
    animatedCard.classList.add("hidden");
    animatedCard.classList.remove(`deal-${from}-card`);
    animatedCard.classList.remove(slot);
    console.log(slot);
    front.classList.add("flip-card");
    back.classList.add("flip-card");

}