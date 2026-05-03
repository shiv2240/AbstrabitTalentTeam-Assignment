"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "@/types/bookmark";
import { DashboardHeader } from "./DashboardHeader";
import { BookmarkList } from "./BookmarkList";
import { BookmarkModal } from "./BookmarkModal";
import { NotificationCenter } from "./NotificationCenter";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function BookmarkDashboard({
  user,
  initialBookmarks,
  totalCount,
  currentPage,
}: {
  user: { id: string; email: string; name: string; avatar: string | null };
  initialBookmarks: Bookmark[];
  totalCount: number;
  currentPage: number;
}) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"all" | "recent" | "collections">(
    "all"
  );
  const supabase = createClient();
  const router = useRouter();

  const pageSize = 9;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push(`/dashboard?page=${newPage}`);
  };

  // Sync state when server props change (on navigation)
  useEffect(() => {
    setBookmarks(initialBookmarks);
  }, [initialBookmarks]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // When a change occurs, refresh the server component to get updated slice & count
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user.id, router]);

  const filteredBookmarks = bookmarks.filter((b) => {
    const query = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(query) ||
      b.url.toLowerCase().includes(query) ||
      b.description?.toLowerCase().includes(query) ||
      b.tags?.some((t) => t.toLowerCase().includes(query))
    );
  });

  const handleDelete = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    router.refresh(); // Update server count/state
  };

  const handleEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-surface">
      <DashboardHeader
        user={user}
        onAddClick={() => {
          setEditingBookmark(null);
          setIsModalOpen(true);
        }}
        layout={layout}
        onLayoutChange={setLayout}
      />

      <main className="max-w-container-max mx-auto px-lg py-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-lg mb-xl">
          <div className="flex items-center gap-2 p-1 bg-surface-container rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-2.5 rounded-xl text-body-sm font-bold transition-all ${
                activeTab === "all"
                  ? "bg-white text-primary shadow-sm"
                  : "text-outline hover:text-on-surface"
              }`}
            >
              All Library
            </button>
            <button
              onClick={() => setActiveTab("recent")}
              className={`px-6 py-2.5 rounded-xl text-body-sm font-bold transition-all ${
                activeTab === "recent"
                  ? "bg-white text-primary shadow-sm"
                  : "text-outline hover:text-on-surface"
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setActiveTab("collections")}
              className={`px-6 py-2.5 rounded-xl text-body-sm font-bold transition-all ${
                activeTab === "collections"
                  ? "bg-white text-primary shadow-sm"
                  : "text-outline hover:text-on-surface"
              }`}
            >
              Collections
            </button>
          </div>

          <div className="relative flex-1 max-w-md group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              type="text"
              placeholder="Search bookmarks, tags, or links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ambient-shadow"
            />
          </div>
        </div>

        <BookmarkList
          bookmarks={filteredBookmarks}
          searchQuery={searchQuery}
          onDelete={handleDelete}
          onEdit={handleEdit}
          isEmpty={bookmarks.length === 0}
          isFiltered={searchQuery.length > 0}
          onAddClick={() => {
            setEditingBookmark(null);
            setIsModalOpen(true);
          }}
          layout={layout}
        />

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-outline-variant/30 text-outline hover:text-primary hover:border-primary disabled:opacity-30 disabled:hover:text-outline disabled:hover:border-outline-variant/30 transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-2xl border border-outline-variant/10">
              <span className="text-body-sm font-bold text-on-surface">Page</span>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 || 
                    pageNum === totalPages || 
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all ${
                          currentPage === pageNum
                            ? "bg-primary text-white shadow-md shadow-primary/20 scale-110"
                            : "text-outline hover:text-on-surface hover:bg-white"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  if (
                    (pageNum === 2 && currentPage > 3) || 
                    (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return <span key={pageNum} className="text-outline text-[10px]">•••</span>;
                  }
                  return null;
                })}
              </div>
              <span className="text-body-sm text-outline font-medium">of {totalPages}</span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-outline-variant/30 text-outline hover:text-primary hover:border-primary disabled:opacity-30 disabled:hover:text-outline disabled:hover:border-outline-variant/30 transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}
      </main>

      <NotificationCenter userId={user.id} />

      {isModalOpen && (
        <BookmarkModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingBookmark(null);
          }}
          onSuccess={(bookmark) => {
            if (editingBookmark) {
              setBookmarks((prev) =>
                prev.map((b) => (b.id === bookmark.id ? bookmark : b))
              );
            } else {
              // Note: In paginated mode, newly added item might not be on current page
              // but we show it optimistically if on page 1.
              if (currentPage === 1) {
                setBookmarks((prev) => [bookmark, ...prev].slice(0, 9));
              }
            }
            router.refresh();
          }}
          userId={user.id}
          initialBookmark={editingBookmark || undefined}
        />
      )}
    </div>
  );
}
