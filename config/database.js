const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'n_blog',
    connectionLimit: 30
});

module.exports = pool;
