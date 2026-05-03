import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LoginPage(props: {
  searchParams: Promise<{ code?: string }>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  // Handle case where code lands here instead of callback
  if (searchParams.code) {
    redirect(`/auth/callback?code=${searchParams.code}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="bg-surface min-h-screen w-full flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-12 w-full max-w-[448px] text-center shadow-lg border border-outline-variant/20 flex flex-col items-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 primary-gradient rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-3xl">
              bookmark
            </span>
          </div>
        </div>
        <h1 className="text-h1 font-black text-on-background tracking-tighter mb-2">
          Welcome to ZenMark
        </h1>
        <p className="text-body-md text-on-surface-variant font-medium mb-6">
          Curate your digital clarity.
        </p>

        <p className="text-body-sm text-outline mb-8 leading-relaxed text-pretty">
          Sign in with your Google account to access your private bookmarks,
          synced in real-time across all your tabs.
        </p>

        {/* Google Sign In Button */}
        <form action="/auth/login" method="POST" className="w-full">
          <button
            type="submit"
            className="w-full group flex items-center justify-center gap-3 primary-gradient hover:opacity-90 active:scale-95 text-white font-bold px-6 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="rgba(255,255,255,0.7)"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="rgba(255,255,255,0.5)"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="rgba(255,255,255,0.3)"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </form>

        <p className="text-label-caps text-outline-variant mt-8 uppercase tracking-widest text-[10px]">
          SECURE • ENCRYPTED • PRIVATE
        </p>

        <div className="mt-8 pt-6 border-t border-outline-variant/20">
          <Link
            href="/"
            className="text-primary hover:text-secondary text-sm font-semibold transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
