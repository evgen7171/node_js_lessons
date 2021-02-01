const queryBuilder = require('./service/queryBuilder/dbOperation');

// const fields = [
//     {
//         columnName: 'name',
//         dataType: 'VARCHAR(45)'
//     }
// ];

queryBuilder().removeColumn('tasks', 'rrr', console.log)
