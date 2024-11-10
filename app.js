const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto'); 

const app = express();

app.use(cors({
    origin: 'https://security-frontend-1rih.onrender.com', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'] 
})); 
app.use(bodyParser.json()); 

app.get('/', (req, res) => {
    res.send('Server radi!');
});

let data = "";
let encryptionEnabled = false;
const secretKey = crypto.randomBytes(32); 
const iv = crypto.randomBytes(16);  

app.post('/api/save-data', (req, res) => {
    let inputData = req.body.data;
    if (encryptionEnabled) {
        const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
        let encryptedData = cipher.update(inputData, 'utf8', 'hex');
        encryptedData += cipher.final('hex');
        inputData = encryptedData;
    }
    data = inputData;
    res.send({ success: true, message: 'Podaci su sačuvani!' });
});

app.get('/api/get-data', (req, res) => {
    let responseData = data;
    res.send({ data: responseData });
});

app.post('/api/toggle-encryption', (req, res) => {
    encryptionEnabled = req.body.encryptionEnabled;
    console.log('Encryption enabled:', encryptionEnabled); 
    res.send({ success: true, encryptionEnabled });
});

const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server radi na portu ${port}`);
});
