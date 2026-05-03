"use server";

import { revalidateTag } from "next/cache";

/**
 * Manually purges the bookmarks cache for a specific user.
 * Call this after any CRUD operation to ensure the next page load is fresh.
 */
export async function revalidateBookmarks(userId: string) {
  revalidateTag(`bookmarks-${userId}`);
}
