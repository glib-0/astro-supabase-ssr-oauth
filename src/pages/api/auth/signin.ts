import type { APIContext, APIRoute } from "astro";
import type { Provider } from "@supabase/supabase-js";
import { createClient } from "src/lib/server";
export const POST: APIRoute = async (context: APIContext) => {
  const formData = await context.request.formData();
  const additionalScope = context.url.searchParams.get("scope");
  const provider = formData.get("provider")?.toString();
  const supabase = createClient(context);

  if (provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,

      options: {
        scopes: `email profile ${additionalScope ?? ""}`.trimEnd(),
        redirectTo: import.meta.env.DEV
          ? "http://localhost:4322/api/auth/callback"
          : `${import.meta.env.PUBLIC_VERCEL_URL}/api/auth/callback`,
        queryParams: { access_type: "offline" },
      },
    });

    if (error) {
      return new Response(error.message, { status: 500 });
    }
    return context.redirect(data.url);
  }
  return context.redirect("/nextpage");
};
