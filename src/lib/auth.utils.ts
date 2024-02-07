import { createClient } from "@lib/server";
import type { APIContext } from "astro";
export const getSession = async (context: APIContext) => {
	const supabase = createClient(context);
	try {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		return session;
	} catch (error) {
		console.error("Error:", error);
		return null;
	}
};

export const getUserInfo = async (userId: string, context: APIContext) => {
	const supabase = createClient(context);
	try {
		const { data, error } = await supabase
			.from("users")
			.select("full_name, email")
			.eq("id", userId)
			.single();

		if (error) {
			console.error("Error fetching user info:", error);
			return null;
		}

		return data;
	} catch (error) {
		console.error("Error:", error);
		return null;
	}
};
