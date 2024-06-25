const mysql = require('mysql2/promise');
require('dotenv').config();
console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME, process.env.DB_PORT);
// Configurazione del database
const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'transitify',
    port: process.env.DB_PORT || 3306
};

// Creazione del pool di connessioni
const pool = mysql.createPool(config);

module.exports = pool;