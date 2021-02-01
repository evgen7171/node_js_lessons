const queryMaker = require('../service/queryMaker');

const Tasks = {
    list: function (callback) {
        const sql = "SELECT * FROM tasks";
        queryMaker(callback, sql)
    },
    add: function (task, callback) {
        const sql = `INSERT tasks(name) VALUES (?)`;
        queryMaker(callback, sql, [task]);
    },

    change: function (id, text, callback) {
        const sql = `UPDATE tasks SET name = ? WHERE ID =  ?`;
        queryMaker(callback, sql, [text, id]);
    },
    complete: function (id, callback) {
        const sql = `UPDATE tasks SET completed = true WHERE ID =  ?`;
        queryMaker(callback, sql, [id]);
    },
    delete: function (id, callback) {
        const sql = `DELETE FROM tasks WHERE ID =  ?`;
        queryMaker(callback, sql, [id]);
    }
}

module.exports = Tasks;