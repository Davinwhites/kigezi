const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../database/data.json');

const readData = () => {
    return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
};

const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
};

module.exports = { readData, writeData };
