import type { APIContext, APIRoute } from "astro";
import { createClient } from "@lib/server";
export const GET: APIRoute = async (context: APIContext) => {
  const supabase = createClient(context);
  context.cookies.delete("provider_token", { path: "/" });
  context.cookies.delete("provider_refresh_token", { path: "/" });
  await supabase.auth.signOut();
  return context.redirect("/");
};
