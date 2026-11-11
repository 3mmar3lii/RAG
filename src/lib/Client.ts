import {createClient } from "@supabase/supabase-js"

export const supbase = createClient(
  process.env.SUBA_BASE_URL!,
  process.env.SUBA_BASE_SECRET_KEY!,
);


// Store Data


// Delete Data 