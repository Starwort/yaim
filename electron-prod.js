const initialiseElectron = require('./electron');
const path = require('path');
const url = require('url');

initialiseElectron(
    url.format({
        pathname: path.join(__dirname, '/build/index.html'),
        protocol: 'file:',
        slashes: true,
    })
);
