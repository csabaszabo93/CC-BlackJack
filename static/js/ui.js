setDesign();
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function setDesign() {
    let deck = document.getElementById('main-deck-player');
    deck.classList.remove('hidden');
    deck = document.getElementById('main-deck-dealer');
    deck.classList.remove('hidden');
    deck = document.getElementById('main-deck-stationer');
    deck.classList.remove('hidden');
    window.onload = async function () {
        await dealCardsTo(["even-l1", "even-r1"], "player");
        await dealCardsTo(["even-l1", "even-r1"], "dealer");
    };
}
async function dealCardsTo(slots, who) {
    let card = document.getElementById(`main-deck-${who}`);
    for (let slot of slots) {
        if (slot === 'even-r1' && who === 'dealer') {
            card.addEventListener('transitionend', function () {
                goBack(card, slot, who);
            });
        } else {
            card.addEventListener('transitionend', function () {
                goBackWithFlip(card, slot, who);
            })
        }
        card.classList.remove("hidden");
        card.classList.add(`deal-${who}-card`);
        card.classList.add(slot);
        if (slot.length > 1) {
            await sleep(1500);
        }
    }
}
function goBackWithFlip(animatedCard, slot, from) {
    let deck = document.getElementById(`${from}-deck`);
    let newCard = deck.getElementsByClassName(slot)[0];
    let back = newCard.getElementsByClassName('back')[0];
    let front = newCard.getElementsByClassName('front')[0];
    newCard.classList.remove("hidden");
    animatedCard.classList.add("hidden");
    animatedCard.classList.remove(`deal-${from}-card`);
    animatedCard.classList.remove(slot);
    front.classList.add("flip-card");
    back.classList.add("flip-card");
}
function goBack(animatedCard, slot, from) {
    let deck = document.getElementById(`${from}-deck`);
    let newCard = deck.getElementsByClassName(slot)[0];
    newCard.classList.remove("hidden");
    animatedCard.classList.add("hidden");
    animatedCard.classList.remove(`deal-${from}-card`);
    animatedCard.classList.remove(slot);
}
function flipCard(slot, who) {
    let deck = document.getElementById(`${who}-deck`);
    let card = deck.getElementsByClassName(slot)[0];
    let back = card.getElementsByClassName('back')[0];
    let front = card.getElementsByClassName('front')[0];
    front.classList.add("flip-card");
    back.classList.add("flip-card");
}