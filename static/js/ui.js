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
        dealCardToPlayer();
    };
}
function moveOut() {
    this.childNodes[0].style.marginTop = "-70%";
}
function moveBack() {
    this.childNodes[0].style.marginTop = "0";
}
function dealCardToPlayer() {
    let cardToPlayer = document.getElementById('main-deck-player');
    cardToPlayer.addEventListener('transitionend', flip);
    cardToPlayer.classList.add("deal-player-card");
}
function dealCardToDealer() {
    this.classList.add("deal-dealer-card");
}
function flip() {
    this.classList.add("flip-card");
}