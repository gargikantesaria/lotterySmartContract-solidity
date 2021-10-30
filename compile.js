const path = require('path');
const fs = require('fs');
const solc =  require('solc');

const helloWorldPath = path.resolve(__dirname, 'contracts', 'helloWorld.sol');
const source = fs.readFileSync( helloWorldPath, 'utf-8');

module.exports = solc.compile(source, 1).contracts[':helloWorld'];

