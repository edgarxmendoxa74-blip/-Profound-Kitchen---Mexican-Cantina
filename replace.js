const fs = require('fs');
const path = require('path');

const filePaths = [
    './src/components/ImageUpload.tsx',
    './src/components/MultiImageUpload.tsx',
    './src/components/SiteSettingsManager.tsx',
    './supabase/migrations/20260228000000_zweren_ph_initial_data.sql',
    './supabase/migrations/20260228000001_zweren_ph_full_setup.sql',
    './supabase/migrations/20260303000001_add_coupons.sql',
    './supabase/migrations/20260228000002_create_storage_buckets.sql',
];

filePaths.forEach(f => {
    try {
        const fullPath = path.resolve(f);
        if (!fs.existsSync(fullPath)) return;

        let content = fs.readFileSync(fullPath, 'utf8');
        let original = content;

        // Replacements
        content = content.replace(/zweren-/g, 'brand-');
        content = content.replace(/Zweren Ph/g, 'Profound + Kitchen');
        content = content.replace(/ZWEREN Logo/g, 'Brand Logo');
        content = content.replace(/Zweren/g, 'Profound');
        content = content.replace(/clothing store/g, 'restaurant');
        content = content.replace(/\/zweren-logo\.jpg/g, '/logo.jpg');
        content = content.replace(/\/images\/zweren-logo\.png/g, '/logo.jpg');

        // SiteSettingsManager specific
        if (f.includes('SiteSettingsManager.tsx')) {
            content = content.replace("`text-4xl font-black text-brand-black font-montserrat ${logoPreview ? 'hidden' : ''}`}>Z</div", "`text-4xl font-black text-brand-black font-montserrat ${logoPreview ? 'hidden' : ''}`}>P</div");
        }

        if (original !== content) {
            fs.writeFileSync(fullPath, content);
            console.log('Updated', f);
        }
    } catch (err) {
        console.error('Error on', f, err);
    }
});
