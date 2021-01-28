const Subject = require('./Subject');
const chalk = require("chalk");
const {MOVE_TRANSITION} = require("./constants");

class Player extends Subject {
    showCardsMessage() {
        console.log(chalk.black.bgMagenta('Ваши карты'));
    }

    getAction(actionID, placeID) {
        if (actionID === 1 && placeID) {
            return {
                text: `[${chalk.green(actionID + ' ' + placeID)}] добавить карту на <${chalk.red(placeID)}>-место`,
                cmd: actionID + ' ' + placeID
            };
        }
        if (actionID === 1) {
            return {
                text: `[${chalk.green(actionID)}] добавить карту на <${chalk.red(placeID)}>-место`,
                cmd: actionID.toString()
            };
        }
        if (actionID === 2) {
            return {
                text: `[${chalk.green(actionID)}] закончить ход <${chalk.red(actionID)}>`,
                cmd: actionID.toString()
            };
        }
        if (actionID === 3) {
            return {
                text: `[${chalk.green(actionID + ' ' + placeID)}] сделать сплит на <${chalk.red(placeID)}>-месте`,
                cmd: actionID + ' ' + placeID
            };
        }
        return false;
    }

    getAvailableActions() {
        const actions1 = [];
        const cmd1 = [];
        const {text: actions2, cmd: cmd2} = this.getAction(2);
        const actions3 = [];
        const cmd3 = [];
        this.places.forEach((place, placeID) => {
            const status = this.getStatusOnPlace(placeID);
            if (status) {
                return;
            }
            const {text: actionText, cmd: actionCmd} = this.getAction(1, placeID);
            actions1.push(actionText);
            cmd1.push(actionCmd);
            if (this.canSplitPlace(placeID)) {
                const {text: actionText, cmd: actionCmd} = this.getAction(3, placeID);
                actions3.push(actionText);
                cmd3.push(actionCmd);
            }
        })
        return {texts: [...actions1, actions2, ...actions3], cmds: [...cmd1, cmd2, ...cmd3]};
    }

    showAvailableActions() {
        const availableActions = this.getAvailableActions().texts;
        if (availableActions.length === 1) {
            return MOVE_TRANSITION;
        }
        console.log(chalk.black.bgYellow('В [скобках] указаны команды:'));
        console.log(availableActions.join(',\n'));
    }

    fillPlayedPlaces() {
        this.places.forEach((place, placeID) => {
            if (!this.playedPlaces[placeID]) {
                this.playedPlaces[placeID] = arrayMaxElem(this.getScoreByPlaceID(placeID));
            }
        })
    }

    action(cmd) {
        if (this.getAvailableActions().cmds.indexOf(cmd) === -1) {
            return this.incorrectAction();
        }
        const {actionID, placeID} = this.getCmdParams(cmd);
        switch (actionID) {
            case '1':
                this.issueCardOnPlaceID(placeID);
                const result = this.showAvailableActions();
                console.log(result)
                if (result === MOVE_TRANSITION) {
                    this.fillPlayedPlaces();
                    return MOVE_TRANSITION;
                }
                return true;
            case '2':
                this.fillPlayedPlaces();
                return MOVE_TRANSITION;
            case '3':
                const [placeID1, placeID2] = this.split(placeID);
                this.issueCardOnPlaceID(placeID1);
                this.issueCardOnPlaceID(placeID2);
                this.showAvailableActions();
                return true;
            default:
                return this.incorrectAction();
        }
    }

    incorrectAction() {
        console.log('Некорректный ввод. Попробуйте еще раз');
        this.showAllCards();
        this.showAvailableActions();
        return false;
    }

    getCmdParams(str) {
        const array = [...str.matchAll(/^(\d+)( (\d*))?$/g)];
        if (!array[0]) {
            return false;
        }
        if (!array[0][2]) {
            return {
                actionID: array[0][1]
            }
        }
        return {
            actionID: array[0][1],
            placeID: array[0][2].slice(1),
        }
    }

    showIssueMessage() {
        console.log(chalk.cyan('выдача карты игроку...'));
    }
}

module.exports = Player;