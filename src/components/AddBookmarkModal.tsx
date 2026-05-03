"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Bookmark } from "@/types/bookmark";
import toast from "react-hot-toast";

type Props = {
  userId: string;
  onClose: () => void;
  onAdded: (bookmark: Bookmark) => void;
};

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function AddBookmarkModal({ userId, onClose, onAdded }: Props) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ url?: string; title?: string }>({});

  const supabase = createClient();

  const validate = () => {
    const newErrors: { url?: string; title?: string } = {};
    if (!url.trim()) {
      newErrors.url = "URL is required.";
    } else if (!isValidUrl(url.trim())) {
      newErrors.url = "Please enter a valid URL (e.g. https://example.com)";
    }
    if (!title.trim()) {
      newErrors.title = "Title is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { data, error } = await supabase
      .from("bookmarks")
      .insert({
        user_id: userId,
        url: url.trim(),
        title: title.trim(),
        description: description.trim() || null,
        tags,
      })
      .select()
      .single();

    setIsLoading(false);

    if (error) {
      toast.error("Failed to save bookmark. Please try again.");
      return;
    }

    toast.success("Bookmark saved!");
    onAdded(data as Bookmark);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-md bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal Card */}
      <div className="glass-panel w-full rounded-2xl ambient-shadow overflow-hidden flex flex-col transition-all modal-panel shadow-2xl border border-white/40 ring-1 ring-black/5">
        {/* Modal Header */}
        <div className="px-xl pt-xl pb-md flex items-center justify-between">
          <div>
            <h2 className="font-h1 text-h1 text-on-surface mb-xs">
              Add Bookmark
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Save a new link to your curated collection.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              close
            </span>
          </button>
        </div>

        {/* Modal Content (Form) */}
        <form onSubmit={handleSubmit} className="px-xl pb-xl space-y-lg">
          {/* URL Field */}
          <div className="space-y-xs">
            <label className="text-label-caps uppercase text-outline font-semibold tracking-widest px-1">
              URL
            </label>
            <div className="group relative">
              <input
                className={`w-full bg-surface-container-lowest border ${errors.url ? "border-error" : "border-slate-200/50"} rounded-xl px-lg py-md text-body-md focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm`}
                placeholder="https://example.com/insightful-article"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (errors.url) setErrors((p) => ({ ...p, url: undefined }));
                }}
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                link
              </span>
            </div>
            {errors.url && (
              <p className="text-error text-xs mt-1 px-1">{errors.url}</p>
            )}
          </div>

          {/* Title Field */}
          <div className="space-y-xs">
            <label className="text-label-caps uppercase text-outline font-semibold tracking-widest px-1">
              Title
            </label>
            <div className="group relative">
              <input
                className={`w-full bg-surface-container-lowest border ${errors.title ? "border-error" : "border-slate-200/50"} rounded-xl px-lg py-md text-body-md focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm`}
                placeholder="Enter a descriptive title..."
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title)
                    setErrors((p) => ({ ...p, title: undefined }));
                }}
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-variation-settings-fill">
                text_fields
              </span>
            </div>
            {errors.title && (
              <p className="text-error text-xs mt-1 px-1">{errors.title}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-xs">
            <label className="text-label-caps uppercase text-outline font-semibold tracking-widest px-1">
              Description
            </label>
            <div className="group relative">
              <textarea
                className="w-full bg-surface-container-lowest border border-slate-200/50 rounded-xl px-lg py-md text-body-md focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none shadow-sm"
                placeholder="What makes this bookmark special?"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <span className="material-symbols-outlined absolute right-4 top-3 text-slate-300">
                description
              </span>
            </div>
          </div>

          {/* Tags Field */}
          <div className="space-y-xs">
            <label className="text-label-caps uppercase text-outline font-semibold tracking-widest px-1">
              Tags
            </label>
            <div className="group relative">
              <input
                className="w-full bg-surface-container-lowest border border-slate-200/50 rounded-xl px-lg py-md text-body-md focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
                placeholder="Design, Inspiration, Case Study"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                label
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-md pt-md">
            <button
              type="button"
              onClick={onClose}
              className="px-xl py-md text-body-md font-semibold text-outline hover:text-on-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="primary-gradient px-xl py-md rounded-xl text-body-md font-bold text-white shadow-lg hover:shadow-primary/20 active:opacity-80 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">
                    progress_activity
                  </span>
                  Saving...
                </>
              ) : (
                "Save Bookmark"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
