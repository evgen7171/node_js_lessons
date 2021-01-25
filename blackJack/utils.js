const ProgressBar = require("progress");
const chalk = require("chalk");

function waitMessage({text, color = 'yellow'}, fun = null) {
    const bar = new ProgressBar(chalk[color](`${text}... [:bar]`), {total: 5});
    const timer = setInterval(() => {
        bar.tick();
        if (bar.complete) {
            if (typeof fun === 'function') {
                fun();
            }
            clearInterval(timer);
        }
    }, 200);
}

const arrayMinElem = arr => arr.reduce((a, b) => Math.min(a, b));
const arrayMaxElem = arr => arr.reduce((a, b) => Math.max(a, b));

module.exports = {waitMessage, arrayMinElem, arrayMaxElem};