const https = require('https');
const fs = require('fs');
const path = require('path');

const API_URL = 'kigezi-festival-backend.onrender.com';
const BACKUP_DIR = path.join(__dirname, 'database_backup');

if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

const endpoints = [
    { name: 'gallery', path: '/api/gallery' },
    { name: 'content', path: '/api/content' },
    { name: 'news', path: '/api/news' },
    { name: 'contacts', path: '/api/contacts' }
];

async function backup() {
    console.log('--- STARTING DATABASE EXTRACTION ---');
    
    for (const ep of endpoints) {
        console.log(`Extracting ${ep.name}...`);
        https.get(`https://${API_URL}${ep.path}`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                const filePath = path.join(BACKUP_DIR, `${ep.name}.json`);
                fs.writeFileSync(filePath, data, 'utf8');
                console.log(`✅ Saved ${ep.name}.json to database_backup folder`);
            });
        }).on('error', (err) => {
            console.error(`❌ Failed to extract ${ep.name}:`, err.message);
        });
    }
}

backup();
