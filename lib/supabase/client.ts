import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "./database.types.ts"

// Client-side Supabase client
export const createClient = () => createClientComponentClient<Database>()

// If you need a service role client (server-side only)
export const createServiceClient = () =>
  createClientComponentClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  })
