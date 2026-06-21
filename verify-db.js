import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env
const envPath = path.resolve(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key length:", supabaseAnonKey ? supabaseAnonKey.length : 0);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
  console.log("Testing connection and querying puzzles table...");
  try {
    const { data, error } = await supabase
      .from('puzzles')
      .select('*')
      .limit(5);

    if (error) {
      console.error("Query Error (Note: Have you run the schema.sql script in your Supabase dashboard?):", error);
    } else {
      console.log("Successfully fetched puzzles from database!");
      console.log("Puzzles Count:", data.length);
      console.log("Puzzles Sample:", data);
    }
  } catch (err) {
    console.error("Exception:", err);
  }
}

verify();
