"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/utils/supabase/client";

export type Notification = {
  id: string;
  title: string;
  message: string;
  time: Date;
  type: "add" | "delete" | "update";
  isRead: boolean;
};

export function NotificationCenter({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          let type: Notification["type"] = "add";
          let title = "";
          let message = "";

          if (payload.eventType === "INSERT") {
            type = "add";
            title = "Bookmark Saved";
            message = `Added "${payload.new.title}" to library.`;
          } else if (payload.eventType === "DELETE") {
            type = "delete";
            title = "Bookmark Removed";
            message = "A bookmark was deleted.";
          } else if (payload.eventType === "UPDATE") {
            type = "update";
            title = "Bookmark Updated";
            message = `Updated "${payload.new.title}".`;
          }

          const newNotification: Notification = {
            id: Math.random().toString(36).substring(7),
            title,
            message,
            time: new Date(),
            type,
            isRead: false,
          };

          setNotifications((prev) => [newNotification, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="group relative">
      {/* Bell Trigger */}
      <button className="relative w-10 h-10 rounded-xl flex items-center justify-center text-outline hover:text-primary hover:bg-surface-container transition-all group-hover:text-primary">
        <span className="material-symbols-outlined text-[24px]">
          notifications
        </span>
        {hasUnread && (
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary border-2 border-white rounded-full"></span>
        )}
      </button>

      {/* Dropdown Popover */}
      <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
        <div className="w-80 bg-white rounded-2xl border border-outline-variant/30 shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low/50">
            <h3 className="text-body-sm font-bold text-on-surface">Recent Activity</h3>
            {notifications.length > 0 && (
              <button
                onClick={() => setNotifications([])}
                className="text-[10px] font-black uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          
          <div className="max-h-[320px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 px-6 text-center">
                <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-3 text-outline/30">
                  <span className="material-symbols-outlined text-2xl">
                    notifications_off
                  </span>
                </div>
                <p className="text-xs font-medium text-outline">No recent activity</p>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="px-4 py-3 hover:bg-surface-container/50 transition-colors flex gap-3"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      n.type === "add" ? "bg-primary/10 text-primary" : 
                      n.type === "delete" ? "bg-error/10 text-error" : 
                      "bg-secondary/10 text-secondary"
                    }`}>
                      <span className="material-symbols-outlined text-lg">
                        {n.type === "add" ? "add_link" : n.type === "delete" ? "delete_sweep" : "edit_note"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-on-surface truncate">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-outline line-clamp-1">
                        {n.message}
                      </p>
                      <p className="text-[9px] text-outline/60 mt-1 font-bold uppercase tracking-tighter">
                        {formatDistanceToNow(n.time, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-2 bg-surface-container-low/30 border-t border-outline-variant/5 text-center">
            <p className="text-[9px] text-outline/40 font-black uppercase tracking-[0.2em]">
              ZenMark Pulse
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
