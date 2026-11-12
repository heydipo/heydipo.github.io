import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://qzhtgwhpcncyaxsameox.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dYpE3lDeUZIMwTr0VCE8GQ_WnuUaG7H';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

