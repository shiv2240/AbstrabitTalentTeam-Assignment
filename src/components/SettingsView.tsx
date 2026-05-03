"use client";

import { useState } from "react";
import Image from "next/image";

type User = {
  id: string;
  email: string;
  avatar: string | null;
  name: string;
};

type Props = {
  user: User;
};

export function SettingsView({ user }: Props) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-on-background tracking-tighter mb-3">Settings</h1>
        <p className="text-body-lg text-outline">Manage your workspace, profile, and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Settings Navigation */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: "profile", label: "Profile", icon: "person" },
            { id: "account", label: "Account", icon: "manage_accounts" },
            { id: "appearance", label: "Appearance", icon: "palette" },
            { id: "notifications", label: "Notifications", icon: "notifications" },
            { id: "privacy", label: "Privacy & Security", icon: "shield" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? "bg-white text-primary font-bold shadow-sm ring-1 ring-black/5"
                  : "text-outline hover:text-on-surface hover:bg-white/50"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
              <span className="text-body-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-9">
          <div className="glass-panel rounded-[32px] p-8 border border-white/40 ambient-shadow">
            {activeTab === "profile" && (
              <div className="space-y-10">
                <section>
                  <h3 className="text-xl font-bold text-on-surface mb-6">Public Profile</h3>
                  <div className="flex items-center gap-8 mb-8">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-surface-container-highest overflow-hidden ring-4 ring-white shadow-lg">
                        {user.avatar ? (
                          <Image src={user.avatar} alt={user.name} width={96} height={96} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl font-black text-outline">
                            {user.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-lg">{user.name}</h4>
                      <p className="text-body-sm text-outline mb-4">Your avatar and name are visible to other ZenMark users in shared collections.</p>
                      <button className="text-primary font-bold text-body-sm hover:underline">Remove Avatar</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-label-caps font-bold text-outline text-[10px] uppercase tracking-widest px-1">Display Name</label>
                      <input 
                        className="w-full bg-white border border-slate-200/50 rounded-xl px-4 py-3 text-body-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                        defaultValue={user.name}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-label-caps font-bold text-outline text-[10px] uppercase tracking-widest px-1">Email Address</label>
                      <input 
                        className="w-full bg-slate-50 border border-slate-200/50 rounded-xl px-4 py-3 text-body-sm text-outline outline-none cursor-not-allowed"
                        defaultValue={user.email}
                        readOnly
                      />
                    </div>
                  </div>
                </section>

                <hr className="border-outline-variant/10" />

                <section>
                  <h3 className="text-xl font-bold text-on-surface mb-6">Bio</h3>
                  <textarea 
                    className="w-full bg-white border border-slate-200/50 rounded-xl px-4 py-3 text-body-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none"
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                  <p className="text-[11px] text-outline mt-2 px-1">Brief description for your profile. URLs and @mentions are allowed.</p>
                </section>

                <div className="flex justify-end gap-4 pt-4">
                  <button className="px-6 py-3 text-body-sm font-bold text-outline hover:text-on-surface transition-colors">Discard changes</button>
                  <button className="primary-gradient px-8 py-3 rounded-xl text-body-sm font-bold text-white shadow-lg hover:shadow-primary/20 transition-all active:scale-95">Save Profile</button>
                </div>
              </div>
            )}

            {activeTab !== "profile" && (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                <span className="material-symbols-outlined text-6xl mb-4">construction</span>
                <h3 className="text-xl font-bold text-on-surface mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings</h3>
                <p className="text-body-md text-outline">This section is coming soon in the public beta.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
