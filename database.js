const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: null,
    database: 'secrets'
});

db.connect((err) => {
    if(err) {
        // If the database doesn't exists
        if (err.code === 'ER_BAD_DB_ERROR') {
            const newDb = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: null
            })
            newDb.query("CREATE DATABASE secrets", (err) => {
                if (err) throw err;
            })
        };
    };
    console.log("Successfully connected to database")

    // Creating secret table if it doesn't exists
    db.query("CREATE TABLE IF NOT EXISTS secret(hash VARCHAR(10) PRIMARY KEY, secretText VARCHAR(255), createdAt DATETIME, expiresAt DATETIME, remainingViews INT)", (err) => {
        if (err) throw err;
    })
});


module.exports = db;