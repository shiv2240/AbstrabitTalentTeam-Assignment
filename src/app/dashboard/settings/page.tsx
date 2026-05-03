import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SettingsView } from "@/components/SettingsView";
import Link from "next/link";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Settings Navigation Bar */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-outline-variant/30">
        <div className="max-w-[1200px] mx-auto px-lg h-16 flex items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-body-sm font-bold text-outline hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-lg py-xl">
        <SettingsView
          user={{
            id: user.id,
            email: user.email ?? "",
            avatar: user.user_metadata?.avatar_url ?? null,
            name: user.user_metadata?.full_name ?? user.email ?? "User",
          }}
        />
      </main>
    </div>
  );
}
