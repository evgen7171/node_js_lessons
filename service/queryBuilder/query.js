const mysql2 = require('mysql2');
const options = require('../../config').db;

/**
 * Запрос к базе данных (SQL)
 * @param sql
 * @param params
 * @param middleware
 * @param callback
 */
const query = (sql, params, middleware, callback) => {
    if (!callback) {
        callback = middleware;
    } else {
        callback = (data) => {
            const handledData = middleware(data);
            callback(handledData);
        }
    }
    const pool = mysql2.createPool(options).promise();
    (async function () {
        try {
            [data, fields] = await pool.query(sql, params)
            callback(data);
        } catch (error) {
            console.log(error);
        } finally {
            await pool.end();
        }
    })()
}

module.exports = query;