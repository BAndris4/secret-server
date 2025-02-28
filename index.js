const express = require('express');
const mysql = require('mysql');

const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: null
});

db.connect((err) => {
    if(err) throw err;
    console.log("Successfully connected to database")
});

app.listen('3000', () => {
    console.log("Server started on port 3000");
})