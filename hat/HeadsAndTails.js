const chalk = require('chalk');
class HeadsAndTails {
    constructor() {
        this.init();
        console.log(chalk.black.bgBlue('*** Игра орел и решка ***'));
        console.log(chalk.blue('---> Для выхода введите quit'));
        this.initIO();
        this.gameData.game++;
        this.tossing();
        this.run();
    }

    init() {
        const DFO = require('./utils').DFO;
        const logFile = require('./utils').getLogFile('hat');
        this.dfo = new DFO(logFile);
        const gameData = this.dfo.readData();
        this.getData(gameData);
    }

    getData(data) {
        const emptyData = {head: 0, tail: 0, edge: 0, score: 0, game: 0};
        if (!data) {
            this.gameData = emptyData;
        } else {
            try {
                this.gameData = JSON.parse(data);
            } catch (e) {
                this.gameData = emptyData;
            }
        }
    }

    initIO() {
        const readline = require('readline');
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    tossing() {
        const ProgressBar = require("progress");
        console.log(chalk.black.bgYellow('Побросим монетку'));
        const bar = new ProgressBar(chalk.yellow("Ожидание... [:bar]"), {total: 5});
        const timer = setInterval(() => {
            bar.tick();
            if (bar.complete) {
                console.log(chalk.cyan('Что выпало орел(1) или решка(2) ?'));
                clearInterval(timer);
            }
        }, 200);
    }

    getAnswer(answer) {
        switch (answer) {
            case '1':
                return 'head';
            case '2':
                return 'tail';
            default:
                return null;
        }
    }

    getCoinSide() {
        const random = Math.random();
        const edgeProbability = 0.06;
        if (random >= 0.5 - edgeProbability / 2 && random < 0.5 + edgeProbability / 2) return 'edge';
        if (random < 0.5) {
            return 'head'
        } else {
            return 'tail'
        }
    }

    messageByAnswer = answer => {
        if (answer === this.coinSide) {
            console.log(chalk.black.bgGreen('Поздравляю, Вы угадали!'));
            this.gameData.score++;
            console.log(chalk.green('Ваш счёт: ', this.gameData.score));
        } else {
            console.log(chalk.black.bgRed('К сожалению, Вы неугадали'));
            console.log(chalk.red('Ваш счёт: ', this.gameData.score));
        }
    }

    run() {
        const _ = this;
        this.rl.on('line', function (cmd) {
            if (cmd === 'quit') {
                _.rl.close();
                return;
            }
            _.coinSide = _.getCoinSide();
            _.gameData[_.coinSide]++;
            if (_.coinSide === 'edge') {
                console.log('Монета упала на ребро. Редкий случай!');
                console.log('Подбрасываем еще раз.');
                _.tossing();
                return;
            }
            const answer = _.getAnswer(cmd);
            if (!answer) {
                console.log('Некорректный ввод. Попробуйте еще раз.');
                console.log('Что выпало орел(1) или решка(2) ?');
            } else {
                _.messageByAnswer(answer);
            }
            _.dfo.writeData(JSON.stringify(_.gameData));
            _.tossing();
        });
    }
}
module.exports = HeadsAndTails;