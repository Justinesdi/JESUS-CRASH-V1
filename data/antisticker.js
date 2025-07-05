const fs = require('fs');
const path = './data/antisticker.json';

// Kreye fichye a si li pa egziste
function initializeAntiStickerSettings() {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, JSON.stringify({ gc: false }));
    }
}

// Jwenn eta aktyèl la
function getAnti(type) {
    const data = JSON.parse(fs.readFileSync(path));
    return data[type] ?? false;
}

// Mete yon nouvo eta
function setAnti(type, value) {
    const data = JSON.parse(fs.readFileSync(path));
    data[type] = value;
    fs.writeFileSync(path, JSON.stringify(data));
}

module.exports = {
    initializeAntiStickerSettings,
    getAnti,
    setAnti
};
