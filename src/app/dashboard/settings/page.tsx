import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BookmarkDashboard } from "@/components/BookmarkDashboard";
import { Bookmark } from "@/types/bookmark";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch bookmarks just in case (though we might not show them in settings)
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <BookmarkDashboard
      user={{
        id: user.id,
        email: user.email ?? "",
        avatar: user.user_metadata?.avatar_url ?? null,
        name: user.user_metadata?.full_name ?? user.email ?? "User",
      }}
      initialBookmarks={(bookmarks as Bookmark[]) ?? []}
    />
  );
}
