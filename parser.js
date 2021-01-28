// const request = require('request');
// const cheerio = require('cheerio');
// const fs = require('fs');
//
// function getData(){
//     const fileContent = fs.readFileSync("data.json", "utf8");
//     return JSON.parse(fileContent);
// }
//
// function getCategories(urls, site) {
//     const name = {};
//     const link = {};
//     const object = urls[site]['category'];
//     const selector = urls[site]['selector'];
//     Object.keys(object).forEach(key => {
//         name[key] = object[key].name;
//         link[key] = object[key].link;
//     });
//     return {name, link, selector};
// }
//
// function getSites() {
//     const urls = getData();
//     return Object.keys(urls);
// }
//
// function getContent(site, category) {
//     return new Promise((req, res) => {
//         const urls = getData();
//         const categories = getCategories(urls, site);
//
//         request(categories.link[category], function (error, response, html) {
//             if (!error && response.statusCode === 200) {
//                 const $ = cheerio.load(html);
//                 $('.' + categories.selector).each(function (i, element) {
//                     return $(this).text()
//                 });
//             } else {
//                 console.log(error, response.statusCode);
//                 return false;
//             }
//         });
//     })
// }
//
// module.exports = {getContent, getContent, getData};