// Орел и решка

const name = process.env.USERNAME ? ', ' + process.env.USERNAME : '';
console.log("Привет" + name, " !");

const HeadsAndTails = require('./HeadsAndTails');
const hat = new HeadsAndTails();

