const https = require('https');

const options = {
    hostname: 'kjjgclpvfiiuhufxcwvn.supabase.co',
    path: '/rest/v1/menu_items?select=name,category,base_price',
    method: 'GET',
    headers: {
        'apikey': 'sb_publishable_xkmp8wFIOoLLdyxIwF3eqQ_hifGIRGO',
        'Authorization': 'Bearer sb_publishable_xkmp8wFIOoLLdyxIwF3eqQ_hifGIRGO'
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (d) => {
        data += d;
    });
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data || '[]');
            console.log('MENU ITEMS COUNT:', parsed.length);
            parsed.slice(0, 10).forEach((item, i) => {
                console.log(`${i + 1}. ${item.name} (${item.category}) - ₱${item.base_price}`);
            });
        } catch (e) {
            console.log('Raw data was:', data);
        }
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.end();
