const mysql2 = require('mysql2');
const options = require('../config').db;

module.exports = function (cb, sql, params = []) {
    const pool = mysql2.createPool(options).promise();
    if(!cb){
        cb = () => {}
    }

    pool.query(sql,params)
        .then(([data, fields]) => {
            cb(data);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            pool.end();
        });
};