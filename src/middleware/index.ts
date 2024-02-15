import { defineMiddleware } from "astro/middleware";
import { supabase } from "@lib/client";
import micromatch from "micromatch";
import type { APIContext } from "astro";
import { getSession } from "@lib/auth.utils";
const protectedRoutes = ["/nextpage(|/*)"];
const redirectRoutes = ["/"];

export const onRequest = defineMiddleware(async (context: APIContext, next) => {
	console.log("middleware triggered");
	const { data, error: userError } = await supabase.auth.getUser();
	console.log(userError.status);
	const session = await getSession(context);
	const accessToken = session?.access_token;
	const refreshToken = session?.refresh_token;
	if (micromatch.isMatch(context.url.pathname, protectedRoutes)) {
		if (userError.status === 401) {
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
