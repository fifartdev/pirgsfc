import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["el", "en"];
const defaultLocale = "el";

// Paths that bypass locale prefix redirect
const BYPASS_PREFIXES = [
  "_next",
  "api",
  "admin",      // Payload CMS admin
  "club-admin", // Greek custom admin panel
];

/**
 * Light-weight club-admin auth gate.
 * Full JWT verification happens server-side in requireClubAdmin().
 * Here we only check cookie presence to guard against accidental navigation.
 */
function clubAdminProxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/club-admin")) return;

  // Allow the login page and its POST actions
  if (pathname === "/club-admin/login" || pathname.startsWith("/club-admin/login/")) {
    return;
  }

  const token = request.cookies.get("payload-token");
  if (!token) {
    const loginUrl = new URL("/club-admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

function localeProxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next internals, API routes, Payload admin, club admin, and static files
  const isBypassed =
    BYPASS_PREFIXES.some(
      (prefix) =>
        pathname.startsWith(`/${prefix}/`) || pathname === `/${prefix}`
    ) ||
    pathname.includes(".") ||
    pathname.startsWith("/_");

  if (isBypassed) return;

  // Canonicalize explicit /el URLs to the unprefixed default locale
  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    request.nextUrl.pathname = pathname.slice(`/${defaultLocale}`.length) || "/";
    return NextResponse.redirect(request.nextUrl);
  }

  // Non-default locales (e.g. /en) keep their prefix and route as-is
  const hasNonDefaultLocale = locales.some(
    (locale) =>
      locale !== defaultLocale &&
      (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
  );
  if (hasNonDefaultLocale) return;

  // Bare paths are the default locale (Greek); rewrite internally without
  // exposing the /el prefix in the browser's address bar.
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(rewriteUrl);
}

export function proxy(request: NextRequest) {
  const clubResponse = clubAdminProxy(request);
  if (clubResponse) return clubResponse;

  const localeResponse = localeProxy(request);
  if (localeResponse) return localeResponse;

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals and files with extensions
    "/((?!_next|.*\\..*).*)",
  ],
};
