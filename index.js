const express = require('express');
const db = require('./database.js');

const app = express();

app.listen('3000', () => {
    console.log("Server started on port 3000");
})

app.get('/secret/:hash', (req, res) => {
    const hash = req.params.hash;
    db.query(`SELECT * FROM secret WHERE hash = ?`, [hash], (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
})