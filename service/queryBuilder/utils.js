/**
 * Получение строки из свойств полей для дальнейшей вставки в запрос
 * @param field поле
 * @returns {string}
 */
function getPreparedFieldPropString(field) {
    const arr = [];
    arr.push("`" + field.columnName + "`");
    field.dataType && arr.push(field.dataType);
    field.notNull ? arr.push('NOT NULL') : arr.push('NULL');
    field.autoIncrement && arr.push(field.autoIncrement && 'AUTO_INCREMENT');
    return arr.join(' ');
}

/**
 * Получение свойств первичного ключа (SQL)
 * @param fieldName
 * @returns {{uniqueIndex: boolean, notNull: boolean, dataType: string, autoIncrement: boolean, columnName, primaryKey: boolean}}
 */
function getPrimaryKeyField(fieldName) {
    return {
        columnName: fieldName,
        dataType: 'INT',
        primaryKey: true,
        notNull: true,
        uniqueIndex: true,
        autoIncrement: true,
    }
}

/**
 * Подготовка свойств поля для вставки
 * @param fields
 * @returns {string}
 */
function prepareInsertFields(fields) {
    const firstArr = [];
    const secondArr = [];
    fields.forEach(field => {
        firstArr.push(getPreparedFieldPropString(field));
        field.primaryKey && secondArr.push(`PRIMARY KEY (\`${field.columnName}\`)`);
        field.uniqueIndex && secondArr.push(`UNIQUE INDEX \`${field.columnName}_UNIQUE\` (\`${field.columnName}\`)`);
    })
    return [...firstArr, ...secondArr].join(',');
}

module.exports = {getPreparedFieldPropString, getPrimaryKeyField, prepareInsertFields}