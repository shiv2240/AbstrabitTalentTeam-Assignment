import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BookmarkDashboard } from "@/components/BookmarkDashboard";
import { Bookmark } from "@/types/bookmark";
import { getCachedBookmarks } from "@/utils/bookmarks";

export default async function DashboardPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || "1", 10);
  const supabase = await createClient();

  // Fetch user first to get the ID for the cache key
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Use the paginated cached fetcher (built-in "Redis-like" speed)
  const { bookmarks, totalCount } = await getCachedBookmarks(user.id, page, 9);

  return (
    <BookmarkDashboard
      user={{
        id: user.id,
        email: user.email ?? "",
        avatar: user.user_metadata?.avatar_url ?? null,
        name: user.user_metadata?.full_name ?? user.email ?? "User",
      }}
      initialBookmarks={bookmarks}
      totalCount={totalCount}
      currentPage={page}
    />
  );
}
