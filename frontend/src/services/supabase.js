import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Prevent crashes on Vercel/local if environment variables are not configured yet
const safeUrl = supabaseUrl || 'https://placeholder-please-set-env-variables.supabase.co';
const safeAnonKey = supabaseAnonKey || 'placeholder-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY are missing. Please configure them in your Vercel Project Settings.'
  );
}

export const supabase = createClient(safeUrl, safeAnonKey);

