// src/server.js

require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const webhookRoute = require('./routes/webhook');

// Leer certificados SSL (puedes usar los mismos que AclassBlog)
const privateKey = fs.readFileSync('/home/bitnami/ssl/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/home/bitnami/ssl/fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Crear app Express
const app = express();
const PORT = 3002; // Usamos un puerto diferente al 443

// Middleware
app.use(bodyParser.json());

// Rutas
app.use('/webhook', webhookRoute);

// Servidor HTTPS para producción
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () => {
  console.log(`🚀 GPTROBOTIC escuchando en puerto HTTPS ${PORT}`);
});
