import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wouhckzuviiansxbogki.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default supabase;
