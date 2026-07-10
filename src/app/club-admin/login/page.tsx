"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Crest } from "@/components/ui/Crest";
import { loginAction } from "@/lib/club-admin/actions";

const ERROR_MAP: Record<string, string> = {
  service: "Η υπηρεσία δεν είναι διαθέσιμη. Ελέγξτε τη σύνδεση με τη βάση δεδομένων.",
  session: "Η συνεδρία σας έληξε. Παρακαλώ συνδεθείτε ξανά.",
  permission: "Δεν έχετε δικαίωμα πρόσβασης στο admin panel.",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorParam = searchParams.get("error");
  const fromParam = searchParams.get("from");

  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.success) {
      router.push(fromParam ?? "/club-admin/dashboard");
    }
  }, [state, router, fromParam]);

  const errorMessage =
    state?.error ?? (errorParam ? ERROR_MAP[errorParam] : null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Crest size="md" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">PYRGOS AFC</h1>
          <p className="mt-1 text-sm text-gray-500">Πίνακας Διαχείρισης Συλλόγου</p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-400">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">
              Διεύθυνση email
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="admin@pyrgosafc.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-red-600/50 focus:outline-none focus:ring-1 focus:ring-red-600/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">
              Κωδικός πρόσβασης
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-red-600/50 focus:outline-none focus:ring-1 focus:ring-red-600/30"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Σύνδεση…" : "Σύνδεση"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
