const Subject = require('./Subject');
const chalk = require("chalk");
const {arrayMinElem} = require("./utils");
const {arrayMaxElem} = require("./utils");

class Dialer extends Subject {
    showIssueMessage() {
        console.log(chalk.cyan('выдача карты дилеру...'));
    }

    showCardsMessage() {
        console.log(chalk.black.bgMagenta('Карты дилера:'));
    }

    move() {
        this.showAllCards();
        let idx = 0;
        while (idx < this.getPlacesCount()) {
            const check = this.checkPlace(idx);
            if (['overflow', 'blackJack', 'stop'].indexOf(check) !== -1) {
                idx++;
            }
            if (check === 'split') {
                const [placeID1, placeID2] = this.split(idx);
                this.issueCardOnPlaceID(placeID1);
                this.issueCardOnPlaceID(placeID2);
            }
            if (check === 'continue') {
                this.issueCardOnPlaceID(idx);
            }
        }
        this.fillPlayedPlaces();
    }

    isDialerOverflowByPlaceID(placeID) {
        const sum = this.getScoreByPlaceID(placeID);
        const result = sum.length && arrayMinElem(sum) > 14;
        if (result) {
            this.setStatusOnPlace(placeID, 'Stop');
        }
        return result;
    }

    checkPlace(placeID) {
        if (this.isOverflowByPlaceID(placeID)) {
            return 'overflow';
        } else if (this.isBlackJackByPlaceID(placeID)) {
            return 'blackJack';
        } else if (this.canSplitPlace(placeID)) {
            return 'split';
        } else if (this.isDialerOverflowByPlaceID(placeID)) {
            return 'stop';
        } else {
            return 'continue'
        }
    }

    fillPlayedPlaces() {
        this.playedPlaces.forEach((place, placeID) => {
            if (place === 'Stop') {
                const score = this.getScoreByPlaceID(placeID);
                this.playedPlaces[placeID] = arrayMaxElem(score);
            }
        });
    }
}

module.exports = Dialer;