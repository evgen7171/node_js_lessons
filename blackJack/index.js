const readline = require('readline');
const chalk = require('chalk');
const fs = require('fs');

const file = require('../hat/utils').getLogFile();
const Deck = require('./Deck');
const Player = require('./Player');
const Dialer = require('./Dialer');
const {MOVE_TRANSITION} = require("./constants");
const {LOSE, DRAW, WIN} = require("./constants");
const {waitMessage} = require('./utils');

class BlackJack {
    constructor(file) {
        this.initLaunch();
        this.gameData = [];
        this.deck = new Deck();
        this.player = new Player(this);
        this.dialer = new Dialer(this);
        this.playedPlaces = {};
        this.blackJacks = [];

        this.greeting();
        this.launch();
    }

    initLaunch() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    launch() {
        const _ = this;
        _.rl.on('line', function (cmd) {
            if (cmd === 'quit') {
                _.stop();
                return;
            }
            _.process(cmd);
        });
    }

    stop() {
        console.log('Счёт игры: ');
        console.log('*******');
        console.log(this.player.playedPlaces);
        console.log(this.dialer.playedPlaces);
        this.rl.close();
    }

    registerBlackJack() {
        if (this.player.isBlackJackByPlaceID(0)) {
            this.blackJacks.push('player');
        } else if (this.dialer.isBlackJackByPlaceID(0)) {
            this.blackJacks.push('dialer');
        } else {
            return false;
        }
        return true;
    }

    checkBlackJack() {
        if (this.blackJacks.length && !this.dialer.isBlackJackByPlaceID(0)) {
            this.player.playedPlaces.push('Black Jack!')
            return WIN;
        } else if (this.blackJacks.length && !this.dialer.isBlackJackByPlaceID(0)) {
            this.player.playedPlaces.push('Black Jack!')
            this.dialer.playedPlaces.push('Black Jack!')
            return DRAW;
        } else if (!this.blackJacks.length && this.dialer.isBlackJackByPlaceID(0)) {
            this.dialer.playedPlaces.push('Black Jack!')
            return LOSE;
        } else {
            return false;
        }
    }

    greeting() {
        console.log(chalk.black.bgBlue('*** Black Jack ***'));
        waitMessage({text: 'Мешаем карты'}, () => {
            this.player.issueCardOnPlaceID();
            this.dialer.issueCardOnPlaceID();
            this.player.issueCardOnPlaceID();
            this.registerBlackJack();
            this.dialer.issueCardOnPlaceID();
            const check = this.checkBlackJack();
            if (check) {
                this.stop();
            } else {
                this.player.showAllCards();
                this.player.showAvailableActions();
            }
        })
    }

    canDialerMove(action) {
        return action === MOVE_TRANSITION;
    }

    process(cmd) {
        const resultAction = this.player.action(cmd);
        if (this.canDialerMove(resultAction)) {
            this.dialer.move();
            this.stop();
        }
    }
}

// module.exports = () => new blackJack(file);

new BlackJack(file);
