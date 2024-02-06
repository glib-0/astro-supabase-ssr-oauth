import { createClient } from "src/lib/server";
import { type APIContext, type APIRoute } from "astro";

export const GET: APIRoute = async (context: APIContext) => {
	const requestUrl = new URL(context.request.url);
	const code = requestUrl.searchParams.get("code");
	const next = requestUrl.searchParams.get("next") || "/nextpage";

	if (code) {
		const supabase = createClient(context);

		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			return context.redirect(next);
		}
	}

	// return the user to an error page with instructions
	return context.redirect("/auth/auth-code-error");
};
