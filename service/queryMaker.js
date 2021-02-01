const mysql2 = require('mysql2');
const options = require('./config').db;

module.exports = function (sql) {
    const pool = mysql2.createPool(options).promise();

    pool.query(sql)
        .then(([data, fields]) => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            pool.end();
        });
};