import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["el", "en"];
const defaultLocale = "el";

function getLocale(request: NextRequest): string {
  const accept = request.headers.get("accept-language") ?? "";
  // Greek is the club's primary language; only switch when English clearly leads.
  const first = accept.split(",")[0]?.trim().toLowerCase() ?? "";
  if (first.startsWith("en")) return "en";
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals, API routes, and any file with an extension.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
