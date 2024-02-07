# Astro + Supabase SSR OAuth

This is a minimal starter kit to help integrate Astro with Supabase's new SSR package for Auth. I used Azure as the OAuth provider.

Pure Astro with no front-end framework. Also includes minimal Supabase query example.

### Why?

The Astro docs use the older Supabase client library, which uses cookies in the client browser to store the access token. You have to pass the token to Supabase every time you create a client to access tables restricted to authenticated users. The Supabase SSR package does server-side auth to handle this for you, so the client browser never sees the tokens.

I found integrating them a little confusing because of the conflicting guides in the docs, so I hope this helps clear things up for you if you're having trouble.

## Project Setup

```text
/
├── src/
│ 	├── components/
│ 	│ 	└── MSSignIn.astro	 		// Microsoft's required sign in button
│ 	├── layouts/
│ 	│ 	└── Layout.astro
│ 	└── pages/
│ 		└── index.astro
│ 		└── nextpage.astro  		// Callback redirects here if auth successful
│ 		└── api/auth 				// Auth routes
│ 				└── callback.ts 	// Route to redirect to after auth
│ 				└── signin.ts
│ 				└── signout.ts
└── package.json
└── astro.config.mjs 				// output must be 'server'
└── .env
```

-   Make your own .env file containing your Supabase anon API key and Supabase URL from Dashboard>Settings>API:

    -   The `PUBLIC` prefix is necessary for Astro and React components. Other frameworks may have different prefix requirements.

```
PUBLIC_SUPABASE_URL=https://<your-supabase-url>.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<apikey>
PUBLIC_VERCEL_URL=http://localhost:4321
```

## ⚡ Supabase setup

-   Create a free Supabase account and start a new project
-   Go to the **Database** tab in the sidebar and create a table named `test`.
    -   Add a column `message` with type `text` and click **Save**.
-   In the **Authentication** tab, click on _Policies_ and add a new policy.
    -   Use the 'Enable read access to everyone template'
    -   Change the name to something like 'Enable access for authenticated users'
    -   Change the _Allowed operation_ to `ALL`, and the _Target roles_ to `authenticated`
    -   Leave the `USING` expression as `true`, and save the policy.
-   Still in **Authentication**, click on _Providers_ and enable your provider of choice.
    -   Follow this guide in the [Supabase docs](https://supabase.com/docs/guides/auth/social-login) to set up Azure or another OAuth provider. Note that you will need the Callback URL from here to setup the provider
    -   For Azure setup the Platform config as a Web app rather than an SPA, otherwise the PKCE flow won't work.
-   Click on _URL Configuration_
    -   Set the _Site URL_ to `http://localhost:4321/` if you are using the default Astro dev port. Note the trailing forward slash, apparently it's important. I didn't test that.
    -   If you are deploying to something like Vercel, set the _Site URL_ as `https://<your-vercel-project>.app/` and add `http://localhost:4321/**` as a _Redirect URL_ so you can continue working with your dev environment.

## 🔺 Vercel setup (Optional)

-   Create new Vercel project and attach your repo from Github.
-   Use the deployment URL as your _Site URL_ above.
-   You can also set additional _Redirect URLs_ with wildcards to cover deployment-specific URLs
-   Under **Settings**, click on _Environment Variables_ and copy and paste the content of your .env file into the Key Value inputs under _Create new_. You can paste the whole thing at once and Vercel will parse it for you, or upload the .env file you made.
    -   Change the value of `PUBLIC_VERCEL_URL` to `https://<your-project-name>.vercel.app`
    -   Even though Vercel exposes `VERCEL_URL` as a system environment variable, it does not seem to prefix it with `PUBLIC` for use by Astro.
-   Redeploy after you change the environment variables.
-   If you try to visit your deployment on another device, you'll need to disable _Vercel authentication_ under _Deployment Protection_ in the Settings

### Auth issues with Vercel deployments

-   If you've missed anything above, the provider redirect will not work and you'll either get redirected to your localhost or the index page. I think Google OAuth requires you to add your deployment URL (the `PUBLIC_VERCEL_URL`) to Authorized redirect URIs in your Google Cloud Console.

## 🚀 Good to go!
