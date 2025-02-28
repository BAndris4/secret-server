const express = require('express');
const db = require('./database.js');
const Secret = require('./secret.js');

const app = express();
app.use(express.urlencoded({ extended: true }))

app.listen('3000', () => {
    console.log("Server started on port 3000");
})

app.get('/secret/:hash', (req, res) => {
    const hash = req.params.hash;
    db.query(`SELECT * FROM secret WHERE hash = ?`, [hash], (err, result)=>{
        if (err) throw err;
        if (result.length == 0) {
            res.status(404).json({});
        } else {
            const currentSecret = result[0];
            currentSecret.remainingViews -= 1;
            db.query('UPDATE secret SET remainingViews = remainingViews-1', err=>{if (err) throw err;});
            db.query('DELETE FROM secret WHERE remainingViews = 0', err=>{if (err) throw err;});
            res.status(200).json(currentSecret);


        }
    })
})

app.post('/secret', (req, res) => {
    const {secret, expireAfter, expireAfterViews} = req.body;

    if (!secret || !expireAfter || !expireAfterViews ) {
        return res.status(405).json({})
    }

    const newSecret = new Secret(secret, expireAfter, expireAfterViews);
    db.query('INSERT INTO secret (hash, secretText, createdAt, expiresAt, remainingViews) VALUES (?, ?, ?, ?, ?)',
        [newSecret.getHash, newSecret.getSecret, newSecret.getCreatedAt, newSecret.getExpireAfter, newSecret.getExpireAfterViews], (err) => {
                    if (err) throw err;
                })
    return res.status(200).json(newSecret)
})