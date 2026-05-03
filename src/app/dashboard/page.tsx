import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BookmarkDashboard } from "@/components/BookmarkDashboard";
import { Bookmark } from "@/types/bookmark";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Parallelize user and bookmark fetching for better performance
  const [userResult, bookmarksResult] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false })
  ]);

  const user = userResult.data.user;
  const bookmarks = bookmarksResult.data;
  const error = bookmarksResult.error;

  if (!user) {
    redirect("/login");
  }

  if (error) {
    console.error("Error fetching bookmarks:", error);
  }

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
