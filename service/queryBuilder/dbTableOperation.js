const query = require("./query");
const {options} = require("../../config");

/**
 * Операции над таблицами базы дынных (SQL DML)
 * @param tableName
 * @returns {{add: PoolCluster.add, getFields: (function(*): void|*), getAll: (function(*=): void|*), getOne: (function(*, *=): void|*), update: MSMediaKeySession.update, remove: Denque.remove}}
 */
function tableOperation(tableName) {
    const dbName = options.database;
    return {
        getFields: (cb) => query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ?  AND TABLE_SCHEMA = ?",
            [tableName, dbName], (data) => {
                const result = data.map(item => item['COLUMN_NAME'])
                cb(result);
            }),
        getAll: (cb) => query("SELECT * FROM ??", [tableName], cb),
        getOne: (id, cb) => query("SELECT * FROM ?? WHERE id = ?", [tableName, id], cb),
        add: (data, cb) => {
            const keys = Object.keys(data).join(', ');
            const values = "'" + Object.values(data).join("', '") + "'";
            const sql = `INSERT INTO ${tableName}(${keys}) VALUES (${values})`;
            query(sql, [], (res) => cb(res.insertId));
        },
        remove: (id, cb) => {
            query("DELETE FROM `tasks` WHERE id = ?", [id], (res) => cb(res.affectedRows))
        },
        update: (id, data, cb) => {
            const string = Object.keys(data).map(key => key + " = '" + data[key] + "'").join(', ');
            const sql = `UPDATE ${tableName} SET ${string} WHERE id = ?`;
            query(sql, [id], (res) => cb(res.changedRows));
        }
    }
}

module.exports = tableOperation;