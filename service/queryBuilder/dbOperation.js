const query = require("./query");
const {getPreparedFieldPropString} = require("./utils");
const {prepareFields: prepareInsertFields} = require("./utils");
const {options} = require("../../config");

/**
 * Операции над схемой/базой данных (SQL DDL)
 * @returns {{drop: drop, addColumn: addColumn, removeColumn: removeColumn, create: ObjectConstructor.create}}
 */
function dbOperation() {
    const dbName = options.database;
    return {
        create: (tableName, fields, cb) => {
            const string = prepareInsertFields(fields);
            const sql = `CREATE TABLE \`${dbName}\`.\`${tableName}\` (${string});`;
            query(sql, [], cb);
        },
        drop: (tableName, cb) => {
            const sql = `DROP TABLE \`${dbName}\`.\`${tableName}\``;
            query(sql, [], cb);
        },
        addColumn: (tableName, field, cb) => {
            const string = "ADD COLUMN " + getPreparedFieldPropString(field);
            const sql = `ALTER TABLE \`${dbName}\`.\`${tableName}\` ` + string;
            query(sql, [], cb);
        },
        removeColumn: (tableName, fieldName, cb) => {
            const string = "DROP COLUMN " + fieldName;
            const sql = `ALTER TABLE \`${dbName}\`.\`${tableName}\` ` + string;
            query(sql, [], cb);
        }
    }
}

module.exports = dbOperation;