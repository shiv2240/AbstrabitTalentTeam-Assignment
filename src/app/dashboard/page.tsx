import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BookmarkDashboard } from "@/components/BookmarkDashboard";
import { Bookmark } from "@/types/bookmark";
import { getCachedBookmarks } from "@/utils/bookmarks";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch user first to get the ID for the cache key
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Use the cached fetcher (built-in "Redis-like" speed)
  const bookmarks = await getCachedBookmarks(user.id);

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
