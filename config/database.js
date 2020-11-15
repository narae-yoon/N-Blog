const mysql = require('mysql2/promise');
const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'n_blog',
    connectionLimit: 30
};
const pool = mysql.createPool(config);

module.exports = pool;
