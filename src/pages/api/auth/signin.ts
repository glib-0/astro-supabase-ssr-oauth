import type { APIContext, APIRoute } from "astro";
import type { Provider } from "@supabase/supabase-js";
import { createClient } from "src/lib/server";
export const POST: APIRoute = async (context: APIContext) => {
  const formData = await context.request.formData();
  const additionalScope = context.url.searchParams.get("scope");
  console.log(additionalScope);
  const provider = formData.get("provider")?.toString();
  const supabase = createClient(context);

  if (provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,

      options: {
        scopes: `email profile ${additionalScope ?? ""}`.trimEnd(), // change the scopes depending on what permissions you need from the user
        redirectTo: import.meta.env.DEV
          ? "http://localhost:4321/api/auth/callback"
          : `${import.meta.env.PUBLIC_VERCEL_URL}/api/auth/callback`,
      },
    });

    if (error) {
      return new Response(error.message, { status: 500 });
    }
    return context.redirect(data.url);
  }
  // // Uncomment to add email/password auth
  // const email = formData.get("email")?.toString();
  // const password = formData.get("password")?.toString();
  // if (!email || !password) {
  // 	return new Response("Email and password are required", { status: 400 });
  // }

  // const { data, error } = await supabase.auth.signInWithPassword({
  // 	email,
  // 	password,
  // });
  // console.log(data); // Do something with data so Vercel build doesn't throw errors
  // if (error) {
  // 	return new Response(error.message, { status: 500 });
  // }

  return context.redirect("/nextpage");
};
