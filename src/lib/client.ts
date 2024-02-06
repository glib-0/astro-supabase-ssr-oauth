import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
	const supabase = createBrowserClient(
		import.meta.env.PUBLIC_SUPABASE_URL!,
		import.meta.env.PUBLIC_SUPABASE_ANON_KEY!
	);
	return supabase;
};
