const express = require('express');
const db = require('./database.js');
const Secret = require('./secret.js');

const app = express();
app.use(express.urlencoded({ extended: true }))

app.listen('3000', () => {
    console.log("Server started on port 3000");
})

app.get('/secret/:hash', (req, res) => {
    db.query('DELETE FROM secret WHERE expiresAt < SYSDATE()', err=>{if (err) throw err;});
    const hash = req.params.hash;
    db.query(`SELECT * FROM secret WHERE hash = ?`, [hash], (err, result)=>{
        if (err) throw err;
        if (result.length == 0) {
            res.status(404).json({status: 404, message: "Secret not found"});
        } else {
            const currentSecret = result[0];
            db.query('UPDATE secret SET remainingViews = remainingViews-1', err=>{if (err) throw err;});
            db.query('DELETE FROM secret WHERE remainingViews = 0', err=>{if (err) throw err;});
            return res.status(200).json({status: 200, message: "Successful operation", data: currentSecret});
        }
    })
})

app.post('/secret', (req, res) => {
    db.query('DELETE FROM secret WHERE expiresAt < SYSDATE()', err=>{if (err) throw err;});

    const {secret, expireAfterViews, expireAfter} = req.body;
    if (!secret || !expireAfter || !expireAfterViews ) {
        return res.status(405).json({status: 405, message: "Invalid input"})
    }

    const newSecret = new Secret(secret, Number(expireAfterViews), Number(expireAfter));
    db.query('INSERT INTO secret (hash, secretText, createdAt, expiresAt, remainingViews) VALUES (?, ?, ?, ?, ?)',
        [newSecret.getHash, newSecret.getSecret, newSecret.getCreatedAt, newSecret.getExpireAfter, newSecret.getExpireAfterViews], (err) => {
                    if (err) throw err;
                });
    return res.status(200).json({status: 200, message: "Successful operation", data: newSecret})
})