const chalk = require("chalk");
const {arrayMinElem} = require("./utils");

class Subject {
    constructor(game) {
        if (game) {
            this.deck = game.deck;
        }
        this.initPlaces();
        this.playedPlaces = [];
    }

    issueCardOnPlaceID(placeID = 0) {
        const card = this.deck.getRandomCard();
        this.putCardOnPlace(card, placeID);
        this.checkPlace(placeID);
        this.showIssueMessage();
        this.showAllCards();
    }

    initPlaces() {
        this.places = [{cards: []}];
    }

    split(placeID) {
        const newCards = [];
        const idx = this.getPlacesCount();
        this.places[placeID].cards.forEach(card => {
            newCards.push({cards: [card]})
        })
        this.places[placeID] = newCards[0];
        this.places[idx] = newCards[1];
        return [placeID, idx];
    }

    canSplitPlace(placeID) {
        const cards = this.places[placeID].cards;
        if (cards.length !== 2) {
            return false;
        }
        return cards[0] === cards[1] ||
            this.getOneCardScore(cards[0])[0] === this.getOneCardScore(cards[1])[0]
    }

    getOneCardScore(card) {
        if (['J', 'Q', 'K'].indexOf(card) !== -1) {
            return [10]
        } else if (card === 'A') {
            return [1, 11]
        } else {
            return [+card]
        }
    }

    getScore(cards) {
        let score = [0];
        cards.forEach(card => {
            const sum = this.getOneCardScore(card);
            if (sum.length === 1) {
                score = score.map(elem => elem + sum[0]);
            } else if (sum.length === 2) {
                const score1 = score.map(elem => elem + sum[0]);
                const score2 = score.map(elem => elem + sum[1]);
                score = [...score1, ...score2];
            }
        })
        score.sort();
        if (score.length > 1 && score[1] > 21) {
            score = [score[0]];
        }
        return score;
    }

    putCardOnPlace(card, placeID) {
        this.places[placeID].cards.push(card);
    }

    getPlacesCount() {
        return this.places.length;
    }

    showAllCards() {
        this.showCardsMessage();
        this.places.forEach((place, placeID) => {
            const cards = this.getCardsByPlaceID(placeID);
            const placeStr = 'Место<' + chalk.red(placeID) + '>:';
            const cardsStr = 'карты:  ' + this.getCardsByPlaceIDJSON(placeID);
            this.playedPlaces[placeID] = !cards.length && 'Overflow';
            const score = this.getScore(cards);
            if (!score.length || arrayMinElem(score) > 21) {
                this.playedPlaces[placeID] = 'Overflow';
            }
            const scoreStr = 'очки: [' + score + ']';
            const serviceInfo = this.getStatusOnPlace(placeID);
            const serviceInfoStr = serviceInfo ? chalk.black.bgRed(serviceInfo) : '';
            console.log(placeStr + ' ' + cardsStr + ' ' + scoreStr + ' ' + serviceInfoStr);
        })
    }

    getCardsByPlaceIDJSON(placeID) {
        return JSON.stringify(this.places[placeID].cards);
    }

    getCardsByPlaceID(placeID) {
        return this.places[placeID].cards;
    }

    getCardsCountByPlaceID(placeID) {
        return this.places[placeID].cards.length;
    }

    isBlackJackByPlaceID(placeID = 0) {
        if (this.getCardsCountByPlaceID(placeID) !== 2) {
            return false;
        }
        const cards = this.getCardsByPlaceID(placeID);
        const result = cards[0] === 'A' && this.getOneCardScore(cards[1])[0] === 10 ||
            cards[1] === 'A' && this.getOneCardScore(cards[0])[0] === 10;
        if (result) {
            this.setStatusOnPlace(placeID, 'Black Jack!')
        }
        return result;
    }

    isOverflowByPlaceID(placeID) {
        const cards = this.getCardsByPlaceID(placeID);
        const sum = this.getScore(cards);
        const result = sum.length && arrayMinElem(sum) > 21;
        if (result) {
            this.setStatusOnPlace(placeID, 'Overflow');
        }
        return result;
    }

    checkPlace(placeID) {
        if (this.isOverflowByPlaceID(placeID)) {
            return 'overflow';
        } else if (this.isBlackJackByPlaceID(placeID)) {
            return 'blackJack';
        } else {
            return 'continue'
        }
    }

    setStatusOnPlace(placeID, text) {
        this.playedPlaces[placeID] = text;
    }

    getStatusOnPlace(placeID) {
        return this.playedPlaces[placeID];
    }

    getScoreByPlaceID(placeID) {
        return this.getScore(this.getCardsByPlaceID(placeID));
    }
}

module.exports = Subject;