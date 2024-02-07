import type { APIContext, APIRoute } from "astro";
import { createClient } from "@lib/server";
export const GET: APIRoute = async (context: APIContext) => {
	const supabase = createClient(context);
	await supabase.auth.signOut();
	return context.redirect("/");
};
