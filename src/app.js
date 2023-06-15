const path = require('path');
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const cors = require('cors');
const runSeeders = require('./utils/seeds.util');
const createInitialAdmin = require('./utils/createInitialAdmin');

// INIT
const app = express();
const publicPath = path.join(__dirname, 'public');
require(path.join(__dirname, 'database.js')); // Database connection
runSeeders(); // Seeders

// SETTINGS
app.use(cors({
    origin: '*'
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(publicPath));
app.use(require(path.join(__dirname, 'config', 'multer.config')));

// CREATE INITIAL ADMIN
createInitialAdmin();

// ROUTES
const routeFiles = fs.readdirSync(path.join(__dirname, 'routes')).filter( (file) => file.endsWith(".js") );

routeFiles.forEach( (file) => {
    app.use(`/api/${file.split('.')[0]}`, require(path.join(__dirname, 'routes', file)));
    console.log(`Route: /api/${file.split('.')[0]} loaded!` );
});

module.exports = app;