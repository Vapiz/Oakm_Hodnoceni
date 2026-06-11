require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Server běží a je připraven na projekt hodnocení učitelů!');
});

app.listen(PORT, () => {
    console.log(`Server úspěšně nastartoval na http://localhost:${PORT}`);
});