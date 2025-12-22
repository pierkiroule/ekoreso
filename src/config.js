import dotenv from 'dotenv';

dotenv.config();

const parseOrigins = (origins = '') =>
  origins
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

export const SUPABASE_URL = process.env.SUPABASE_URL || '';
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const RESO_PUBLIC_KEY = process.env.RESO_PUBLIC_KEY || '';
export const RESO_ADMIN_KEY = process.env.RESO_ADMIN_KEY || '';
export const CORS_ORIGINS = parseOrigins(process.env.CORS_ORIGINS || '*');
export const PORT = process.env.PORT || 3000;
