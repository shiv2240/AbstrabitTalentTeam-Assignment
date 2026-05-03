"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Bookmark } from "@/types/bookmark";
import { BookmarkList } from "./BookmarkList";
import { AddBookmarkModal } from "./AddBookmarkModal";
import { SettingsView } from "./SettingsView";
import { CollectionsView } from "./CollectionsView";
import { NotificationCenter, Notification } from "./NotificationCenter";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type User = {
  id: string;
  email: string;
  avatar: string | null;
  name: string;
};

type Props = {
  user: User;
  initialBookmarks: Bookmark[];
};

export function BookmarkDashboard({ user, initialBookmarks }: Props) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<
    "all" | "recent" | "collections"
  >("all");
  const [isRealtime, setIsRealtime] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const supabase = createClient();
  const pathname = usePathname();

  const isSettingsPage = pathname === "/dashboard/settings";

  const addNotification = useCallback(
    (type: Notification["type"], title: string, message: string) => {
      const newNotif: Notification = {
        id: Math.random().toString(36).substring(7),
        type,
        title,
        message,
        time: new Date(),
        isRead: false,
      };
      setNotifications((prev) => [newNotif, ...prev].slice(0, 20)); // Keep last 20
    },
    [],
  );

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newB = payload.new as Bookmark;
          setBookmarks((prev) => {
            if (prev.some((b) => b.id === newB.id)) return prev;
            return [newB, ...prev];
          });
          addNotification(
            "add",
            "Bookmark Saved",
            `Added "${newB.title}" to your library`,
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setBookmarks((prev) => {
            const deleted = prev.find((b) => b.id === payload.old.id);
            if (deleted) {
              addNotification(
                "delete",
                "Bookmark Removed",
                `Deleted "${deleted.title}"`,
              );
            }
            return prev.filter((b) => b.id !== payload.old.id);
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new as Bookmark;
          setBookmarks((prev) =>
            prev.map((b) => (b.id === updated.id ? updated : b)),
          );
          addNotification(
            "update",
            "Bookmark Updated",
            `Modified details for "${updated.title}"`,
          );
        },
      )
      .subscribe((status) => {
        setIsRealtime(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id, supabase, addNotification]);

  // Collect all unique tags across bookmarks
  const allTags = Array.from(
    new Set(bookmarks.flatMap((b) => b.tags ?? [])),
  ).sort();

  // Derived: filtered bookmarks
  const filteredBookmarks = bookmarks.filter((b) => {
    // Search Filter
    const matchesSearch =
      searchQuery === "" ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);

    // Tag Filter
    const matchesTag = activeTag === null || b.tags?.includes(activeTag);

    // View Filter
    if (currentView === "recent") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const isRecent = new Date(b.created_at) > oneWeekAgo;
      return matchesSearch && matchesTag && isRecent;
    }

    return matchesSearch && matchesTag;
  });

  const handleBookmarkAdded = useCallback(
    (newBookmark: Bookmark) => {
      setBookmarks((prev) => {
        if (prev.some((b) => b.id === newBookmark.id)) return prev;
        return [newBookmark, ...prev];
      });
      addNotification("add", "Bookmark Saved", `Added "${newBookmark.title}"`);
      setIsModalOpen(false);
    },
    [addNotification],
  );

  const handleBookmarkDeleted = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const handleSignOut = async () => {
    await fetch("/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen">
      {/* SideNavBar Shell */}
      <aside className="fixed left-0 top-0 h-full flex flex-col pt-8 pb-4 bg-white/70 backdrop-blur-xl h-screen w-64 border-r border-outline-variant/20 z-50">
        <div className="px-6 mb-10">
          <Link href="/dashboard" className="block">
            <h1 className="text-xl font-black text-on-background tracking-tight">
              ZenMark
            </h1>
            <p className="text-[10px] text-outline font-medium uppercase tracking-[0.2em] mt-1">
              Curate Clarity
            </p>
          </Link>
        </div>
        <nav className="flex-1 space-y-1">
          <div
            className={`px-4 py-2 mx-2 flex items-center gap-3 transition-all cursor-pointer rounded-xl ${
              !isSettingsPage && currentView === "all" && activeTag === null
                ? "text-primary font-semibold border-l-2 border-primary bg-primary/5"
                : "text-outline hover:text-on-background hover:translate-x-1"
            }`}
            onClick={() => {
              setCurrentView("all");
              setActiveTag(null);
              if (isSettingsPage) window.location.href = "/dashboard";
            }}
          >
            <span className="material-symbols-outlined">bookmark</span>
            <span className="font-body-sm">All Bookmarks</span>
          </div>
          <div
            className={`px-4 py-2 mx-2 flex items-center gap-3 transition-all cursor-pointer rounded-xl ${
              !isSettingsPage && currentView === "recent"
                ? "text-primary font-semibold border-l-2 border-primary bg-primary/5"
                : "text-outline hover:text-on-background hover:translate-x-1"
            }`}
            onClick={() => {
              setCurrentView("recent");
              setActiveTag(null);
              if (isSettingsPage) window.location.href = "/dashboard";
            }}
          >
            <span className="material-symbols-outlined">schedule</span>
            <span className="font-body-sm">Recent</span>
          </div>
          <div
            className={`px-4 py-2 mx-2 flex items-center gap-3 transition-all cursor-pointer rounded-xl ${
              !isSettingsPage && currentView === "collections"
                ? "text-primary font-semibold border-l-2 border-primary bg-primary/5"
                : "text-outline hover:text-on-background hover:translate-x-1"
            }`}
            onClick={() => {
              setCurrentView("collections");
              setActiveTag(null);
              if (isSettingsPage) window.location.href = "/dashboard";
            }}
          >
            <span className="material-symbols-outlined">folder</span>
            <span className="font-body-sm">Collections</span>
          </div>

          <div className="pt-8 pb-2 px-6">
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest">
              Workspace
            </span>
          </div>

          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all ${
              isSettingsPage
                ? "text-primary font-semibold border-l-2 border-primary bg-primary/5"
                : "text-outline hover:text-on-background hover:translate-x-1"
            }`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-sm">Settings</span>
          </Link>
        </nav>

        {/* Tags Section (Only in main view) */}
        {!isSettingsPage && allTags.length > 0 && (
          <div className="px-2 mb-4">
            <div className="text-[10px] font-bold text-outline px-4 mb-2 uppercase tracking-widest">
              TAGS
            </div>
            <div className="space-y-1 max-h-[200px] overflow-y-auto hide-scrollbar">
              {allTags.map((tag) => (
                <div
                  key={tag}
                  className={`cursor-pointer rounded-xl px-4 py-2 flex items-center gap-3 transition-all ${
                    activeTag === tag
                      ? "text-primary font-semibold border-l-2 border-primary bg-primary/5"
                      : "text-outline hover:text-on-background hover:translate-x-1"
                  }`}
                  onClick={() => setActiveTag(tag)}
                >
                  <span className="material-symbols-outlined text-sm">
                    label
                  </span>
                  <span className="font-body-sm">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 mt-auto border-t border-outline-variant/20 pt-4">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/5 rounded-xl transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-body-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* TopNavBar Shell */}
      <header className="fixed top-0 right-0 left-64 z-40 flex items-center justify-between px-8 w-[calc(100%-16rem)] h-16 border-b border-outline-variant/20 bg-white/80 backdrop-blur-2xl shadow-sm">
        <div className="flex items-center gap-4 w-1/2">
          <div className="relative w-full ">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">
              search
            </span>
            <input
              className="w-full bg-surface-container border-none rounded-lg pl-10 pr-4 py-2 text-body-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="Search clarity..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 text-xs">
            {isRealtime ? (
              <span className="flex items-center gap-1.5 text-primary">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                Live
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-outline">
                <span className="w-1.5 h-1.5 bg-outline rounded-full"></span>
                Syncing
              </span>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-body-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Bookmark
          </button>

          <div className="flex items-center gap-4 border-l border-outline-variant/30 pl-6 relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                if (!isNotificationsOpen) {
                  setNotifications((prev) =>
                    prev.map((n) => ({ ...n, isRead: true })),
                  );
                }
              }}
              className="material-symbols-outlined text-outline hover:bg-surface-container p-2 rounded-full transition-colors relative"
            >
              notifications
              {notifications.some((n) => !n.isRead) && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse border-2 border-white"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <NotificationCenter
                notifications={notifications}
                onClear={() => setNotifications([])}
              />
            )}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden ring-2 ring-white ring-offset-2 ring-offset-surface-container flex items-center justify-center">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-outline">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="ml-64 pt-24 px-xl pb-xl min-h-screen">
        {/* Dashboard Header */}
        {!isSettingsPage && (
          <div className="flex items-end justify-between mb-lg">
            <div>
              <h2 className="font-h1 text-h1 text-on-surface mb-xs">
                {activeTag
                  ? `#${activeTag}`
                  : currentView === "recent"
                    ? "Recently Added"
                    : currentView === "collections"
                      ? "Collections"
                      : "All Bookmarks"}
              </h2>
              <p className="text-body-lg text-outline">
                {currentView === "collections"
                  ? `${allTags.length} active collection${allTags.length !== 1 ? "s" : ""} found`
                  : bookmarks.length === 0
                    ? "No bookmarks yet — add your first one!"
                    : `${filteredBookmarks.length} item${filteredBookmarks.length !== 1 ? "s" : ""} organized in your digital library`}
              </p>
            </div>
            <div className="flex gap-sm">
              <button className="p-2 rounded-lg bg-white border border-outline-variant/50 text-outline hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">grid_view</span>
              </button>
              <button className="p-2 rounded-lg bg-white border border-outline-variant/50 text-outline hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">view_list</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Content: Bookmark List, Settings, or Collections */}
        {isSettingsPage ? (
          <SettingsView user={user} />
        ) : currentView === "collections" && !activeTag ? (
          <CollectionsView
            bookmarks={bookmarks}
            onTagClick={(tag) => {
              setActiveTag(tag);
              setCurrentView("all");
            }}
          />
        ) : (
          <BookmarkList
            bookmarks={filteredBookmarks}
            searchQuery={searchQuery}
            onDelete={handleBookmarkDeleted}
            isEmpty={bookmarks.length === 0}
            isFiltered={filteredBookmarks.length < bookmarks.length}
            onAddClick={() => setIsModalOpen(true)}
          />
        )}
      </main>

      {/* Add Bookmark Modal */}
      {isModalOpen && (
        <AddBookmarkModal
          userId={user.id}
          onClose={() => setIsModalOpen(false)}
          onAdded={handleBookmarkAdded}
        />
      )}

      {/* Contextual FAB (Mobile friendly/Always accessible) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-tr from-primary to-secondary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 md:hidden"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </div>
  );
}
