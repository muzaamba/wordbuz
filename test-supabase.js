import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kssemmyylumbirsysldb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzc2VtbXl5bHVtYmlyc3lzbGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5ODY4NDQsImV4cCI6MjA5MjU2Mjg0NH0.l8Gk8-9s6z5b2bxQIHkWC6RX5S_Y5c05WgBYtz0rOs0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log("Testing connection...");
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Connection Error:", error);
    } else {
      console.log("Connection successful!", data);
    }
  } catch (err) {
    console.error("Exception:", err);
  }
}

testConnection();
