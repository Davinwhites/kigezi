const https = require('https');

const API_URL = 'kigezi-festival-backend.onrender.com';

function checkCategories() {
    https.get(`https://${API_URL}/api/gallery`, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            const json = JSON.parse(data);
            if (json.success) {
                console.log('--- ALL CATEGORIES IN DB ---');
                const categories = [...new Set(json.data.map(img => img.category))];
                console.log(categories);
                console.log('--- INDIVIDUAL ITEMS ---');
                json.data.forEach(img => {
                    console.log(`Title: ${img.title}, Category: "${img.category}"`);
                });
            }
        });
    }).on('error', (err) => {
        console.error(err);
    });
}

checkCategories();
