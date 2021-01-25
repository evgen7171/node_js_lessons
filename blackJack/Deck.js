class Deck {
    constructor() {
        this.init()
    }

    init() {
        const cards = {};
        const types = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        types.forEach(type => cards[type] = 4);
        this.cards = cards;
    }

    getRandomCard() {
        const cards = this.cards;
        const index = Math.floor(Math.random() * Object.keys(cards).length);
        const key = Object.keys(cards)[index];
        cards[key]--;
        if (!cards[key]) {
            delete cards[key];
        }
        return key;
    }
}

module.exports = Deck;