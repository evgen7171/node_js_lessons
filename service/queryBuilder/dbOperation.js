function dbOperation() {
    const dbName = options.database;
    return {
        create: (tableName, fields, cb) => {
            const string = prepareFields(fields);
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