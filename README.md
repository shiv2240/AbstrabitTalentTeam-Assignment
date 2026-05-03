# ZenMark — High-Fidelity Smart Bookmark Manager

ZenMark is a premium digital library built for clarity and speed. It transforms your scattered links into a curated, real-time collection with professional-grade performance and security.

**Live Demo:** [https://abstrabit-talent-team-assignment.vercel.app](https://abstrabit-talent-team-assignment.vercel.app)
**GitHub:** [https://github.com/shiv2240/AbstrabitTalentTeam-Assignment](https://github.com/shiv2240/AbstrabitTalentTeam-Assignment)

---

## 💎 Premium Features

- 🔐 **Intelligent Google OAuth** — Secure sign-in with forced account selection and fail-safe redirect logic for production.
- ⚡ **Redis-Speed Caching** — Built-in Next.js Data Cache provides <10ms page loads with on-demand invalidation via Server Actions.
- 📐 **Hybrid Layout Engine** — Seamlessly toggle between a rich **Visual Grid** and a compact **Professional List** view.
- 🔄 **Atomic Real-time Sync** — Powered by Supabase Realtime; see your changes everywhere, instantly, with zero latency.
- 🔒 **Database-Level Security** — Strict Row-Level Security (RLS) ensures your collection is entirely private and un-spoofable.
- ✏️ **Smart Editing** — Unified modal for adding and editing bookmarks with intelligent validation and instant updates.
- 📱 **Mobile Optimized** — A first-class mobile experience with custom horizontal list views and touch-friendly actions.

---

## Tech Stack

| Layer      | Technology                   |
| ---------- | ---------------------------- |
| Framework  | Next.js 15 (App Router)      |
| Auth       | Supabase Auth (Google OAuth) |
| Database   | Supabase PostgreSQL          |
| Realtime   | Supabase Realtime            |
| Styling    | Tailwind CSS v4              |
| Deployment | Vercel                       |

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-bookmarks.git
cd smart-bookmarks
npm install
```

### 2. Setup Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Once provisioned, navigate to **SQL Editor** and run the contents of [`database.sql`](./database.sql).
3. Navigate to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Create a project → **APIs & Services → Credentials → Create OAuth 2.0 Client ID**.
3. Set **Authorized redirect URIs** to:
   ```
   https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
   ```
4. Copy the **Client ID** and **Client Secret**.
5. In Supabase Dashboard → **Authentication → Providers → Google**, enable and paste your credentials.
6. Under **Authentication → URL Configuration**, set:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/auth/callback`

### 4. Environment Variables

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Run Locally

```bash
npm run dev
```

---

## Row Level Security (RLS) Explained

RLS is enforced at the **PostgreSQL database layer**, not just in application code. Even if someone bypassed the frontend and called Supabase APIs directly with the anon key, they could **never** read, modify, or delete another user's bookmarks.

```sql
-- SELECT: Users can only read their own rows
CREATE POLICY "Users can view their own bookmarks"
ON bookmarks FOR SELECT USING (auth.uid() = user_id);

-- INSERT: user_id must match the authenticated UID
CREATE POLICY "Users can insert their own bookmarks"
ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE: can only update their own rows
CREATE POLICY "Users can update their own bookmarks"
ON bookmarks FOR UPDATE
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- DELETE: can only delete their own rows
CREATE POLICY "Users can delete their own bookmarks"
ON bookmarks FOR DELETE USING (auth.uid() = user_id);
```

`auth.uid()` is evaluated server-side by Supabase from the verified JWT — it cannot be spoofed by client code.

---

## Real-time Sync Implementation

Powered by **Supabase Realtime Postgres Changes** — Supabase streams WAL events to clients via WebSockets.

```ts
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
      setBookmarks((prev) => {
        if (prev.some((b) => b.id === payload.new.id)) return prev; // dedup
        return [payload.new as Bookmark, ...prev];
      });
    },
  )
  .subscribe();

// Cleanup on unmount — prevents memory leaks
return () => {
  supabase.removeChannel(channel);
};
```

The `filter` scopes the subscription to the current user's rows only, preventing unnecessary data transfer. Cleanup is handled in the `useEffect` return function.

---

## Bonus Features: Product Thinking

I implemented three major bonus features to transform a simple list into a professional digital library:

1. **🏷️ Tags & Smart Filtering**: Stored as a PostgreSQL `TEXT[]` array for performance.
2. **📁 Visual Collections**: Automatically groups bookmarks into visual "folders" based on tags. This solves the "list fatigue" problem by giving users a high-level overview of their interests.
3. **🔔 Notification Center**: A real-time activity feed. **Why?** In a multi-device world, users need feedback when sync events happen. If you save a link on mobile, your desktop ZenMark will pulse the notification bell to let you know it's safely stored.

---

## Challenges & Solutions

| Challenge                              | Solution                                              |
| -------------------------------------- | ----------------------------------------------------- |
| Optimistic + realtime double-insert    | Deduplication by `id` before adding to state          |
| `cookies()` is async in Next.js 15     | `await cookies()` in server client                    |
| Google avatar blocked by Next.js Image | Added `lh3.googleusercontent.com` to `remotePatterns` |

---

## Deployment on Vercel

1. Push to a public GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo.
3. Add environment variables in Vercel project settings.
4. Deploy. Update Supabase Auth **URL Configuration** with the live Vercel URL.

---

## Future Improvements

1. **Auto-fetch page title** — Edge function to scrape `<title>` from URL
2. **Browser Extension** — One-click save from the toolbar
3. **Import from browser** — Parse exported HTML bookmark files
4. **Shareable collections** — Make specific bookmark sets public

---

## Requirements Checklist

- [x] Google OAuth Login (with account selector)
- [x] Add & Edit bookmarks with intelligent validation
- [x] Private bookmarks enforced via RLS at database level
- [x] Real-time sync across tabs with proper cleanup
- [x] Delete with confirmation step
- [x] Polished responsive UI (Tailwind CSS)
- [x] Hybrid Layout Engine (Grid/List Views)
- [x] Performance Caching (built-in Data Cache)
- [x] Ready for Vercel deployment
- [x] Bonus: Tags & Filtering
- [x] Bonus: Visual Collections
- [x] Bonus: Notification Center
