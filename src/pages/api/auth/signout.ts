import type { APIContext } from "astro";
import { createClient } from "@lib/server";
export const GET: APIContext = async (context) => {
	const supabase = createClient(context);
	await supabase.auth.signOut();
	return context.redirect("/");
};
