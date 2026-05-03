"use client";

import { formatDistanceToNow } from "date-fns";

export type Notification = {
  id: string;
  title: string;
  message: string;
  time: Date;
  type: "add" | "delete" | "update";
  isRead: boolean;
};

type Props = {
  notifications: Notification[];
  onClear: () => void;
};

export function NotificationCenter({ notifications, onClear }: Props) {
  return (
    <div className="absolute right-0 top-14 w-80 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-outline-variant/20 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="p-5 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low/50">
        <h3 className="font-display font-bold text-on-surface">Recent Activity</h3>
        {notifications.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs font-bold text-primary hover:text-primary-fixed-dim transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="max-h-[400px] overflow-y-auto py-2">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4 text-outline/30">
              <span className="material-symbols-outlined text-4xl">
                notifications_off
              </span>
            </div>
            <p className="text-sm font-medium text-outline">No recent activity</p>
            <p className="text-[10px] text-outline/60 mt-1 uppercase tracking-wider">
              Stay tuned for updates
            </p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/5">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="px-5 py-4 hover:bg-primary/5 transition-colors flex gap-4 relative group"
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    n.type === "add"
                      ? "bg-primary/10 text-primary"
                      : n.type === "delete"
                      ? "bg-error/10 text-error"
                      : "bg-secondary/10 text-secondary"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {n.type === "add"
                      ? "add_link"
                      : n.type === "delete"
                      ? "delete_sweep"
                      : "edit_note"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-on-surface leading-tight truncate">
                    {n.title}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-outline mt-2 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1 h-1 bg-outline/30 rounded-full"></span>
                    {formatDistanceToNow(n.time, { addSuffix: true })}
                  </p>
                </div>
                {!n.isRead && (
                  <div className="absolute right-4 top-4 w-1.5 h-1.5 bg-primary rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {notifications.length > 0 && (
        <div className="p-3 bg-surface-container-low/30 border-t border-outline-variant/5 text-center">
          <p className="text-[10px] text-outline font-bold uppercase tracking-[0.2em]">
            ZenMark Intelligence
          </p>
        </div>
      )}
    </div>
  );
}
