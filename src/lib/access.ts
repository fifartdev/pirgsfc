import type { Access, AccessResult } from "payload";

type UserWithRole = {
  role?: string;
  [key: string]: unknown;
};

function getRole(user: unknown): string | undefined {
  return (user as UserWithRole)?.role;
}

export const isSuperAdmin: Access = ({ req: { user } }) => {
  return getRole(user) === "superadmin";
};

export const isClubAdmin: Access = ({ req: { user } }) => {
  return getRole(user) === "club_admin";
};

export const isSuperAdminOrClubAdmin: Access = ({ req: { user } }) => {
  const role = getRole(user);
  return role === "superadmin" || role === "club_admin";
};

export const authenticatedOnly: Access = ({ req: { user } }) => {
  return Boolean(user);
};

/** Read: authenticated users see everything; public sees only published. */
export const publishedOnlyOrAuthenticated: Access = ({
  req: { user },
}): AccessResult => {
  const role = getRole(user);
  if (role === "superadmin" || role === "club_admin") return true;
  return {
    _status: { equals: "published" },
  };
};

/** Read: authenticated users see everything; public sees only active records. */
export const activeOnlyOrAuthenticated: Access = ({
  req: { user },
}): AccessResult => {
  const role = getRole(user);
  if (role === "superadmin" || role === "club_admin") return true;
  return {
    status: { not_equals: "archived" },
  };
};

/**
 * For non-versioned collections (e.g. Matches) that use a custom `status` field.
 * Public users see anything that isn't explicitly a draft.
 */
export const nonDraftOrAuthenticated: Access = ({
  req: { user },
}): AccessResult => {
  const role = getRole(user);
  if (role === "superadmin" || role === "club_admin") return true;
  return {
    status: { not_equals: "draft" },
  };
};
