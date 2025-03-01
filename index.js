const cors = require('cors');
const express = require('express');
const db = require('./database.js');
const Secret = require('./secret.js');
const ResponseFormat = require('./responses.js')

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

function handleResponse(req, res, data) {
    const acceptHeader = req.get('Accept');
    const responseFormatter = new ResponseFormat(res);
    responseFormatter.sendResponse(data, acceptHeader);
}

app.listen('3000', () => {
    console.log("Server started on port 3000");
})

app.get('/secret/:hash', (req, res) => {
    db.query('DELETE FROM secret WHERE expiresAt < SYSDATE()', err=>{if (err) throw err;});

    const hash = req.params.hash;

    db.query(`SELECT * FROM secret WHERE hash = ?`, [hash], (err, result)=>{
        if (err) throw err;
        if (result.length == 0) {
            const data = {status: 404, message: "Secret not found"};
            return handleResponse(req, res, data)
        } else {
            const currentSecret = result[0];
            db.query('UPDATE secret SET remainingViews = remainingViews-1 WHERE hash = ?', [currentSecret.hash], err=>{if (err) throw err;});
            db.query('DELETE FROM secret WHERE remainingViews = 0', err=>{if (err) throw err;});
            const data = {status: 200, message: "Successful operation", data: currentSecret};
            return handleResponse(req, res, data)
        }
    })
})

app.post('/secret', (req, res) => {
    db.query('DELETE FROM secret WHERE expiresAt < SYSDATE()', err=>{if (err) throw err;});

    const {secret, expireAfterViews, expireAfter} = req.body;
    if (!secret || !expireAfter || !expireAfterViews ) {
        const data = {status: 405, message: "Invalid input"}
        return handleResponse(req, res, data)
    }

    const usedHashCodes = [];
    db.query('SELECT hash FROM secret', (_, result) => {
        result.forEach(element => {
            usedHashCodes.push(element.hash);
        });
        if (usedHashCodes.length == 9000000000){
            data = {status: 400, message: "No unique hash codes available for new secrets"};
            return handleResponse(req, res, data);
        }
        let newSecret = new Secret(secret, Number(expireAfterViews), Number(expireAfter));
        while (usedHashCodes.includes(newSecret.getHash())){
            newSecret = new Secret(secret, Number(expireAfterViews), Number(expireAfter));
        }

        db.query('INSERT INTO secret (hash, secretText, createdAt, expiresAt, remainingViews) VALUES (?, ?, ?, ?, ?)',
            [newSecret.getHash(), newSecret.getSecret(), newSecret.getCreatedAt(), newSecret.getExpireAfter(), newSecret.getExpireAfterViews()], (err) => {if (err) throw err;});

        data = {status: 200, message: "Successful operation", data: newSecret}
        return handleResponse(req, res, data);
    });
})