"use client";

import { Bookmark } from "@/types/bookmark";
import { BookmarkItem } from "./BookmarkItem";

type Props = {
  bookmarks: Bookmark[];
  searchQuery: string;
  onDelete: (id: string) => void;
  isEmpty: boolean;
  isFiltered: boolean;
  onAddClick: () => void;
};

export function BookmarkList({
  bookmarks,
  searchQuery,
  onDelete,
  isEmpty,
  isFiltered,
  onAddClick,
}: Props) {
  // Empty state: no bookmarks at all
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-primary text-3xl">
            bookmark
          </span>
        </div>
        <h3 className="text-on-background font-semibold text-lg mb-2">
          No bookmarks yet
        </h3>
        <p className="text-outline text-sm leading-relaxed mb-6">
          Start saving your favorite URLs. They&apos;ll be private to you and
          sync instantly across all your tabs.
        </p>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 bg-[linear-gradient(135deg,#0053db_0%,#4b41e1_100%)] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:opacity-90"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add your first bookmark
        </button>
      </div>
    );
  }

  // No results for current search/filter
  if (bookmarks.length === 0 && isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-outline text-2xl">
            search
          </span>
        </div>
        <h3 className="text-on-background font-medium mb-1">
          No results found
        </h3>
        <p className="text-outline text-sm">
          Try a different search term or clear the active tag.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
      {bookmarks.map((bookmark, index) => (
        <div key={bookmark.id} className="h-full">
          <BookmarkItem
            bookmark={bookmark}
            searchQuery={searchQuery}
            onDelete={onDelete}
            featured={index === 0}
          />
        </div>
      ))}

      {/* Add New Card Placeholder */}
      <button
        onClick={onAddClick}
        className="flex flex-col items-center justify-center h-full min-h-[320px] p-xl border-2 border-dashed border-outline-variant/50 rounded-xl hover:bg-white hover:border-primary/50 transition-all group"
      >
        <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-md group-hover:bg-primary/10 group-hover:text-primary transition-all">
          <span className="material-symbols-outlined text-outline group-hover:text-primary">
            add_circle
          </span>
        </div>
        <span className="font-body-lg font-bold text-outline group-hover:text-on-surface">
          Add New Bookmark
        </span>
      </button>
    </div>
  );
}
