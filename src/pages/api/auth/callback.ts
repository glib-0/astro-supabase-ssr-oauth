import { createClient } from "@lib/server";
import { type APIContext, type APIRoute } from "astro";

export const GET: APIRoute = async (context: APIContext) => {
  const requestUrl = new URL(context.request.url);
  const code = requestUrl.searchParams.get("code");
  if (code) {
    const supabase = createClient(context);

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return context.redirect("/nextpage");
    }
  }

  return context.redirect("/");
};
