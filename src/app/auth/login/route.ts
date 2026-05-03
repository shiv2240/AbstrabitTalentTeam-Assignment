import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  const supabase = await createClient();

  // Use environment variable or fall back to the current request's origin
  const requestUrl = new URL(request.url);
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;
  
  // Force HTTPS for Vercel environments to match Supabase redirect whitelists
  if (siteUrl.includes("vercel.app") && !siteUrl.startsWith("http")) {
    siteUrl = `https://${siteUrl}`;
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
      queryParams: {
        prompt: "select_account",
        access_type: "offline",
      },
    },
  });

  if (error || !data.url) {
    redirect("/login?error=Could not authenticate");
  }

  redirect(data.url);
}
