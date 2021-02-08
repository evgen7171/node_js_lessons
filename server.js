const express = require('express');

const productController = require('./controller/productController');

const app = express();

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');

// const router = require('./routers');
// app.use(router);
app.get('/', (req, res) => {
    res.render(JSON.stringify({f: 1}));
})

app.listen(3000, () => {
    console.log('Server listening on 3000 port.');
});
