const express = require('express');
const mysql = require('mysql');

const app = express();

app.listen('3000', () => {
    console.log("Server started on port 3000");
    db.connect((err) => {
        if(err) throw err;
        console.log("Successfully connected to database")
    });
})