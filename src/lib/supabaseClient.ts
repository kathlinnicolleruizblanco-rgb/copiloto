import { createClient } from '@supabase/supabase-js';

// Reemplaza estos valores con tus credenciales de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tu-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
