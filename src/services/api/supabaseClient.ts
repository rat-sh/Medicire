import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Config from 'react-native-config';

// Ensure the environment variables are available
const supabaseUrl = Config.SUPABASE_URL || '';
const supabaseAnonKey = Config.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured && __DEV__) {
  // eslint-disable-next-line no-console
  console.warn('[DEV] Missing Supabase URL or Anon Key. Check your .env file.');
}

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // We disable automatic auth persistence here if the user is handling their own auth system completely.
    // If you want Supabase to handle auth persistence via MMKV, you can inject it here.
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
