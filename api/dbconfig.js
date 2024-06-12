const mysql = require('mysql2/promise');

const config = {
    host: 'localhost',
    user: 'root',
    password: 'Lukotty_02@',
    database: 'transitify',
    port: 3306
};

const pool = mysql.createPool(config);

module.exports = pool;
