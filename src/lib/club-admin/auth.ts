import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";

export type AuthUser = {
  id: string | number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "superadmin" | "club_admin";
};

/**
 * Verifies the current request has a valid Payload session and the user
 * has club_admin or superadmin role.  Redirects to login if not.
 */
export async function requireClubAdmin(): Promise<{
  user: AuthUser;
  payload: NonNullable<Awaited<ReturnType<typeof getPayloadClient>>>;
}> {
  const payload = await getPayloadClient();
  if (!payload) {
    redirect("/club-admin/login?error=service");
  }

  const requestHeaders = await headers();
  let user: AuthUser | null = null;

  try {
    const result = await payload.auth({
      headers: requestHeaders as unknown as Headers,
    });
    if (result.user) {
      user = result.user as unknown as AuthUser;
    }
  } catch {
    redirect("/club-admin/login?error=session");
  }

  if (!user) redirect("/club-admin/login");
  if (user.role !== "superadmin" && user.role !== "club_admin") {
    redirect("/club-admin/login?error=permission");
  }

  return { user, payload };
}

/**
 * Returns the current user without redirecting. Returns null if unauthenticated.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const payload = await getPayloadClient();
  if (!payload) return null;

  try {
    const requestHeaders = await headers();
    const result = await payload.auth({
      headers: requestHeaders as unknown as Headers,
    });
    return (result.user as unknown as AuthUser) ?? null;
  } catch {
    return null;
  }
}
