"use client";

import { useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "pyrgosafc-cookie-consent";

function subscribe() {
  // localStorage consent never changes from outside this component, so there's
  // nothing external to subscribe to — this only exists to satisfy
  // useSyncExternalStore's signature.
  return () => {};
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) === "accepted";
}

// Server never has a stored preference — render as "not yet accepted" so SSR
// output matches the client's first paint before hydration reads localStorage.
function getServerSnapshot() {
  return false;
}

interface CookieBannerProps {
  message: string;
  acceptLabel: string;
}

/** Simple accept-and-dismiss cookie notice — shown when `SiteSettings.cookieBannerEnabled` is on. */
export function CookieBanner({ message, acceptLabel }: CookieBannerProps) {
  const alreadyAccepted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);

  if (alreadyAccepted || dismissed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-night/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-white/80">{message}</p>
        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem(STORAGE_KEY, "accepted");
            setDismissed(true);
          }}
          className="inline-flex shrink-0 items-center rounded-full bg-crimson px-5 py-2 font-display text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-crimson-bright"
        >
          {acceptLabel}
        </button>
      </div>
    </div>
  );
}
