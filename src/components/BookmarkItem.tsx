"use client";

import { useState } from "react";
import { Bookmark } from "@/types/bookmark";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

type Props = {
  bookmark: Bookmark;
  searchQuery: string;
  onDelete: (id: string) => void;
  featured?: boolean;
};

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-primary/20 text-primary rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function BookmarkItem({ bookmark, searchQuery, onDelete, featured = false }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm("Delete this bookmark?")) {
      setIsDeleting(true);
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", bookmark.id);

      if (error) {
        toast.error("Failed to delete bookmark.");
        setIsDeleting(false);
        return;
      }

      toast.success("Bookmark deleted.");
      onDelete(bookmark.id);
    }
  };

  const formattedDate = new Date(bookmark.created_at).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  // Deterministic placeholder image based on ID
  const imageUrl = `https://picsum.photos/seed/${bookmark.id}/800/600`;

  if (featured) {
    return (
      <article className="xl:col-span-2 glass-card rounded-xl overflow-hidden ambient-shadow border border-white/40 hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col group">
        <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="flex flex-col md:flex-row h-full flex-1">
          <div className="md:w-1/2 relative overflow-hidden h-64 md:h-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-label-caps font-label-caps text-primary shadow-sm tracking-widest uppercase">
                Featured
              </span>
            </div>
          </div>
          <div className="md:w-1/2 p-lg flex flex-col justify-center flex-1">
            <p className="text-label-caps font-label-caps text-outline mb-sm uppercase">
              {highlight(getDomain(bookmark.url), searchQuery)}
            </p>
            <h3 className="font-h2 text-h2 text-on-surface mb-md line-clamp-2">
              {highlight(bookmark.title, searchQuery)}
            </h3>
            {bookmark.description && (
              <p className="text-body-md text-outline mb-lg line-clamp-3">
                {highlight(bookmark.description, searchQuery)}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2 mb-lg mt-auto">
              {bookmark.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 bg-surface-container text-on-surface-variant text-body-sm rounded-full border border-outline-variant/30">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-body-sm text-outline">Added {formattedDate}</span>
              <div className="flex gap-3">
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="material-symbols-outlined text-outline hover:text-error transition-colors p-1"
                >
                  delete
                </button>
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors p-1">
                  open_in_new
                </span>
              </div>
            </div>
          </div>
        </a>
      </article>
    );
  }

  return (
    <article className="glass-card rounded-xl overflow-hidden ambient-shadow border border-white/40 hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col group">
      <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full flex-1">
        <div className="h-48 relative overflow-hidden flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imageUrl}
            alt="" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="p-lg flex flex-col flex-1">
          <p className="text-label-caps font-label-caps text-outline mb-xs uppercase">
            {highlight(getDomain(bookmark.url), searchQuery)}
          </p>
          <h3 className="font-body-lg text-body-lg font-bold text-on-surface mb-sm line-clamp-2">
            {highlight(bookmark.title, searchQuery)}
          </h3>
          {bookmark.description && (
            <p className="text-body-sm text-outline mb-md line-clamp-2">
              {highlight(bookmark.description, searchQuery)}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-md mt-auto">
            {bookmark.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 bg-surface-container text-on-surface-variant text-body-sm rounded-full border border-outline-variant/30">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-body-sm text-outline">{formattedDate}</span>
            <div className="flex gap-3">
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="material-symbols-outlined text-outline hover:text-error transition-colors p-1 text-[20px]"
              >
                delete
              </button>
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors p-1 text-[20px]">
                open_in_new
              </span>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}
