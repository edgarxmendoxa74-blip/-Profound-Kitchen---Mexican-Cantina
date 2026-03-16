import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env manually
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

console.log(`Checking connection to: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    const tables = ['categories', 'menu_items', 'variations', 'add_ons', 'site_settings', 'payment_methods'];
    const results = {};

    for (const table of tables) {
        try {
            const { data, error } = await supabase.from(table).select('*').limit(1);
            if (error) {
                results[table] = { status: 'ERROR', message: error.message, code: error.code };
            } else {
                results[table] = { status: 'OK', rows: data ? data.length : 0 };
            }
        } catch (err) {
            results[table] = { status: 'CRASH', message: err.message };
        }
    }

    console.log(JSON.stringify(results, null, 2));
}

diagnose();
