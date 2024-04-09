import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { APIContext } from "astro";

export const createClient = (context: APIContext) => {
  const supabase = createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(key: string) {
          return context.cookies.get(key)?.value;
        },
        set(key: string, value: string, options: CookieOptions) {
          context.cookies.set(key, value, options);
        },
        remove(key: string, options) {
          context.cookies.delete(key, options);
        },
      },
    }
  );
  return supabase;
};
