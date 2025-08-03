import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahnctjprpifuxalqrrps.supabase.co'; // ← Project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFobmN0anBycGlmdXhhbHFycnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NzA1MjcsImV4cCI6MjA2OTQ0NjUyN30.WGjXMHR0nbkkR49uXY57hk60PHoyBaviw1H6WxQHMAo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


