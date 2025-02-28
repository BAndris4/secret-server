const express = require('express');
const db = require('./database.js');

const app = express();

app.listen('3000', () => {
    console.log("Server started on port 3000");
})