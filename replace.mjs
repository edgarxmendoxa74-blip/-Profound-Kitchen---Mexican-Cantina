import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const files = [
    ...walk('./src'),
    ...walk('./supabase'),
    './index.html',
    './README.md'
];

files.forEach(f => {
    try {
        if (!fs.existsSync(f)) return;
        if (f.includes('replace.mjs') || f.includes('replace.js') || f.includes('node_modules')) return;
        if (!f.endsWith('.tsx') && !f.endsWith('.ts') && !f.endsWith('.html') && !f.endsWith('.md') && !f.endsWith('.sql')) return;

        let content = fs.readFileSync(f, 'utf8');
        let original = content;

        // Replacements
        content = content.replace(/zweren-/g, 'brand-');
        content = content.replace(/zweren_/g, 'brand_');
        content = content.replace(/Zweren Ph/g, 'Profound + Kitchen');
        content = content.replace(/ZWEREN Logo/g, 'Brand Logo');
        content = content.replace(/Zweren/g, 'Profound');
        content = content.replace(/zweren/gi, 'profound');
        content = content.replace(/clothing store/gi, 'restaurant');
        content = content.replace(/\/zweren-logo\.jpg/g, '/logo.jpg');
        content = content.replace(/\/images\/zweren-logo\.png/g, '/images/logo.png');

        // SiteSettingsManager specific
        if (f.includes('SiteSettingsManager.tsx')) {
            content = content.replace("`text-4xl font-black text-brand-black font-montserrat ${logoPreview ? 'hidden' : ''}`}>Z</div", "`text-4xl font-black text-brand-black font-montserrat ${logoPreview ? 'hidden' : ''}`}>P</div");
        }

        if (original !== content) {
            fs.writeFileSync(f, content);
            console.log('Updated', f);
        }
    } catch (err) {
        console.error('Error on', f, err);
    }
});
