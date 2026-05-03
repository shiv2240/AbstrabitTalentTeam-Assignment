"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { NotificationCenter } from "./NotificationCenter";
import Link from "next/link";

type Props = {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  onAddClick: () => void;
  layout: "grid" | "list";
  onLayoutChange: (layout: "grid" | "list") => void;
};

export function DashboardHeader({
  user,
  onAddClick,
  layout,
  onLayoutChange,
}: Props) {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-outline-variant/30">
      <div className="max-w-container-max mx-auto px-lg h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link 
          href="/dashboard" 
          className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-white font-bold">
              bookmarks
            </span>
          </div>
          <div>
            <h1 className="text-display-xs font-black text-on-surface tracking-tight">
              ZenMark
            </h1>
            <p className="text-[10px] font-bold text-outline uppercase tracking-widest">
              Digital Library
            </p>
          </div>
        </Link>

        {/* Actions Section */}
        <div className="flex items-center gap-6">
          {/* View Toggle */}
          <div className="hidden sm:flex items-center p-1 bg-surface-container rounded-xl border border-outline-variant/10">
            <button
              onClick={() => onLayoutChange("grid")}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                layout === "grid"
                  ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                  : "text-outline hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined">grid_view</span>
            </button>
            <button
              onClick={() => onLayoutChange("list")}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                layout === "list"
                  ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                  : "text-outline hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined">view_list</span>
            </button>
          </div>

          <div className="h-8 w-[1px] bg-outline-variant/30 hidden sm:block" />

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <NotificationCenter userId={user.id} />
            
            <button
              onClick={onAddClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-body-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>New Bookmark</span>
            </button>

            <div className="group relative">
              <button className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-container transition-colors">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-white shadow-sm flex items-center justify-center text-primary font-black">
                    {user.name[0].toUpperCase()}
                  </div>
                )}
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                <div className="w-64 bg-white rounded-2xl border border-outline-variant/30 shadow-2xl overflow-hidden p-2">
                  <div className="px-4 py-3 border-b border-outline-variant/10">
                    <p className="text-body-sm font-bold text-on-surface truncate">
                      {user.name}
                    </p>
                    <p className="text-body-xs text-outline truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => router.push("/dashboard/settings")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-body-sm text-outline hover:text-on-surface hover:bg-surface-container rounded-xl transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        settings
                      </span>
                      Account Settings
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-body-sm text-error hover:bg-error/10 rounded-xl transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        logout
                      </span>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
