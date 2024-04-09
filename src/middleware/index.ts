import { defineMiddleware } from "astro/middleware";
import { createClient } from "@lib/server";
import micromatch from "micromatch";
import type { APIContext } from "astro";
import { getSession } from "@lib/auth.utils";
const protectedRoutes = ["/nextpage(|/*)"];
const redirectRoutes = ["/"];

export const onRequest = defineMiddleware(async (context: APIContext, next) => {
  console.log("middleware triggered");
  const supabase = createClient(context);
  const { data, error: userError } = await supabase.auth.getUser();

  const session = await getSession(context);
  const accessToken = session?.access_token;
  const refreshToken = session?.refresh_token;
  const providerToken = session?.provider_token;
  const providerRefreshToken = session?.provider_refresh_token;

  if (session && providerToken) {
    context.cookies.set("provider_token", providerToken, { path: "/" });
  }
  if (session && providerRefreshToken) {
    context.cookies.set("provider_refresh_token", providerRefreshToken, {
      path: "/",
    });
  }
  if (micromatch.isMatch(context.url.pathname, protectedRoutes)) {
    if (userError?.status === 401) {
      return context.redirect("/");
    }
    if (!accessToken || !refreshToken) {
      return context.redirect("/");
    }

    const { data, error: sessionError } = await supabase.auth.setSession({
      refresh_token: refreshToken,
      access_token: accessToken,
    });
    if (sessionError) {
      await supabase.auth.signOut();
      return context.redirect("/");
    }
  }

  if (micromatch.isMatch(context.url.pathname, redirectRoutes)) {
    if (accessToken && refreshToken) {
      return context.redirect("/nextpage");
    }
  }
  const response = await next();
  return response;
});
