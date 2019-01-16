setDesign();
function setDesign() {
    let cards = document.querySelectorAll('.my-card');
    let leftMargin = -15;
    for (let i = 0; i < cards.length; i++) {
        if (i !== 0 && i !== 5) {
            cards[i].style.zIndex = `${i}`;
            cards[i].style.marginLeft = `${leftMargin}%`;
        }
    }
    dealAnimation()
}
function moveOut() {
    this.childNodes[0].style.marginTop = "-70%";
}
function moveBack() {
    this.childNodes[0].style.marginTop = "0";
}
function dealAnimation() {
    let cardToPlayer = document.getElementById('main-deck-player');
    let cardToDealer = document.getElementById('main-deck-dealer');
    cardToPlayer.addEventListener('click', dealCardToPlayer);
    cardToPlayer.addEventListener('transitionend', flip);
    cardToDealer.addEventListener('click', dealCardToDealer);
    cardToDealer.addEventListener('transitionend', flip);
}
function dealCardToPlayer() {
    this.classList.add("deal-player-card");
}
function dealCardToDealer() {
    this.classList.add("deal-dealer-card");
}
function flip() {
    this.classList.add("flip-card");
}