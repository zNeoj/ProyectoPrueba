require('dotenv');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const server = express();
server.use(express.json());
server.use(cors());

const dbserver = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

dbserver.connect(err => {
    console.log(
        "host: " + process.env.HOST +
        "\nuser: " + process.env.USER +
        "\npassword: " + process.env.PASSWORD +
        "\ndatabase: " + process.env.DATABASE);
    if (err) throw err;
    console.log('Conectado exitosamente a la BD');
});

server.get('/', (req, res) => {
    res.json({ mensaje: 'q rollo padrinoo' });
});

server.get('/api', (req, res) => {
    res.json({ mensaje: 'q rollo padrino, bienvenido a /api' });
});

const PORT = process.env.PORT;
server.listen(PORT, () => console.log("Back-end escuchando en http://localhost:8080"));