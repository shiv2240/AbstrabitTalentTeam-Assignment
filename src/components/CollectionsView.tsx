"use client";

import { Bookmark } from "@/types/bookmark";

type Props = {
  bookmarks: Bookmark[];
  onTagClick: (tag: string) => void;
};

export function CollectionsView({ bookmarks, onTagClick }: Props) {
  const allTags = Array.from(
    new Set(bookmarks.flatMap((b) => b.tags ?? []))
  ).sort();

  if (allTags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-center mb-4 text-outline">
          <span className="material-symbols-outlined text-3xl">folder_off</span>
        </div>
        <h3 className="text-on-background font-semibold text-lg mb-2">
          No collections found
        </h3>
        <p className="text-outline text-sm leading-relaxed max-w-xs">
          Collections are automatically created from your tags. Add some tags to your bookmarks to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
      {allTags.map((tag) => {
        const count = bookmarks.filter((b) => b.tags?.includes(tag)).length;
        return (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className="glass-panel p-xl rounded-3xl flex flex-col items-start gap-4 hover:translate-y-[-4px] transition-all group text-left border border-white/40 ring-1 ring-black/5 ambient-shadow"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
              <span className="material-symbols-outlined">folder</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
                {tag}
              </h3>
              <p className="text-body-sm text-outline">
                {count} {count === 1 ? "bookmark" : "bookmarks"}
              </p>
            </div>
            <div className="mt-2 w-full flex justify-end">
              <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
