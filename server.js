const express = require('express');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request');

const app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const templating = require('consolidate');
const handlebars = require('handlebars');
templating.requires.handlebars = handlebars;

app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/parser', (req, res) => {
    res.redirect('/');
})

app.post('/', (req, res) => {
    const r = req.body;
    if (!r.site) {
        res.redirect('/');
    }
    const urls = getData();
    res.render('parser', initData(urls, r.site));
})

app.post('/parser', (req, res) => {
    const r = req.body;
    if (!r['category'] || !r['site'] || !r['count']) {
        res.redirect('/')
    }
    const count = r.count;
    const urls = getData();
    const categories = getCategories(urls, r['site']);
    if (!categories) {
        res.redirect('/')
    }
    const link = categories.links[r['category']];
    const selector = categories.selector;

        request(link, function (error, response, html) {
            const content = [];
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(html);
                $('.' + selector).each(function (i, element) {
                    if (i > count) {
                        return;
                    }
                    const dataStr = $(this).text();
                    content.push(dataStr);
                });
            } else {
                content.push(error);
            }
            console.log(content)
            // res.render('parser', {content})
        });
})

function getData() {
    const fileContent = fs.readFileSync("data.json", "utf8");
    return JSON.parse(fileContent);
}

function getSites(urls) {
    return Object.keys(urls).map(key => {
        return {
            name: key,
            title: urls[key].title
        }
    })
}

function getCategories(urls, site) {
    if (!urls[site]) {
        return null
    }
    const names = [];
    const links = [];
    const object = urls[site]['category'];
    const selector = urls[site]['selector'];
    Object.keys(object).forEach(key => {
        names.push({name: key, title: object[key].name});
        links.push({name: key, link: object[key].link});
    });
    return {names, links, selector};
}

function initData(urls, site, category = null) {
    const categories = getCategories(urls, site).names;
    return {
        sites: getSites(urls).map(item => {
            return {...item, selected: item.name === site}
        }),
        categories: categories.map(item => {
            return {...item, selected: item.name === category}
        })
    };
}

app.listen(3000, () => console.log('Listening on port 3000'));