// демонстарция colors
// играет гамму

const colors = require('colors');
const {Player} = require('g-sounds');

const NOTES = [
    [130.81, 0.25],
    [146.83, 0.25],
    [164.81, 0.25],
    [174.61, 0.25],
    [196.00, 0.25],
    [220.00, 0.25],
    [246.94, 0.25],
    [261.63, 0.25],
];
const NOTES_ARR = NOTES.concat([...NOTES].reverse());

const p = new Player();
(async () => {
    console.log('--- ' + 'node.js console example'.green.underline + ' ---'); // outputs green text
    console.log('piano gamma...'.red.inverse); // inverses the color
    console.log('...and rainbow!'.rainbow); // rainbow
    console.log('Lorem ipsum dolor sit amet'.trap); // Drops the bass

    await p.loadBufferFromNotes(NOTES_ARR);
    console.log('loaded...playing...');
    await p.play();
})();



