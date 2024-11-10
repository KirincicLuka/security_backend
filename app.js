const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto'); 

const app = express();

app.use(cors()); 
app.use(bodyParser.json()); 

app.get('/', (req, res) => {
    res.send('Server radi!');
});

let data = "";
let encryptionEnabled = false;
const secretKey = 'secret_key'; 

app.post('/api/save-data', (req, res) => {
    let inputData = req.body.data;
    if (encryptionEnabled) {
        const cipher = crypto.createCipher('aes-256-cbc', secretKey);
        inputData = cipher.update(inputData, 'utf8', 'hex') + cipher.final('hex');
    }
    data = inputData;
    res.send({ success: true, message: 'Podaci su sačuvani!' });
});

app.get('/api/get-data', (req, res) => {
    res.send({ data });
});

app.post('/api/toggle-encryption', (req, res) => {
    encryptionEnabled = req.body.encryptionEnabled;
    console.log('Encryption enabled:', encryptionEnabled); 
    res.send({ success: true, encryptionEnabled });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server radi na portu ${PORT}`);
});
