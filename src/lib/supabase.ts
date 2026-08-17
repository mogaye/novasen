import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://viivxxtheyguacovzizk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpaXZ4eHRoZXlndWFjb3Z6aXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4OTkwNTQsImV4cCI6MjEwMjQ3NTA1NH0.UhhwfyXWjKtIhoaWFJgJzcKzlD6dx3xQM6J2_mSfs1g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

