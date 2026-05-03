"use server";

import { revalidatePath } from "next/cache";

/**
 * Manually purges the dashboard cache.
 * Call this after any CRUD operation to ensure the next page load is fresh.
 */
export async function revalidateBookmarks(userId: string) {
  revalidatePath("/dashboard");
}
