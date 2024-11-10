const express = require('express');
const router = express.Router();
const crypto = require('crypto');

let sensitiveData = '';
let encryptionEnabled = false;

router.post('/api/toggle-encryption', (req, res) => {
    console.log("Toggle encryption endpoint hit"); 
    encryptionEnabled = req.body.encryptionEnabled;
    res.send({ success: true, encryptionEnabled });
});

router.post('/api/save-data', (req, res) => {
    if (encryptionEnabled) {
        const cipher = crypto.createCipher('aes-256-cbc', 'secret_key');
        sensitiveData = cipher.update(req.body.data, 'utf8', 'hex') + cipher.final('hex');
    } else {
        sensitiveData = req.body.data;
    }
    res.send({ success: true });
});

router.get('/api/get-data', (req, res) => {
    if (encryptionEnabled) {
        const decipher = crypto.createDecipher('aes-256-cbc', 'secret_key');
        const decryptedData = decipher.update(sensitiveData, 'hex', 'utf8') + decipher.final('utf8');
        res.send({ data: decryptedData });
    } else {
        res.send({ data: sensitiveData });
    }
});

module.exports = router;
