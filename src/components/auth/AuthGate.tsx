"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Callout } from "@/components/ui";

interface AuthGateProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  tone?: "wine" | "plum" | "slate" | "terra" | "ember";
}

export default function AuthGate({
  children,
  title = "Sign in required",
  description = "Log in to save your progress and participate. Browsing is free — salvation costs extra.",
  tone = "wine",
}: AuthGateProps) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <Callout tone={tone}>
        <p className="font-medium text-ink">Checking credentials...</p>
        <p className="mt-1 text-sm text-ink-soft">The binding is consulting the ledger.</p>
      </Callout>
    );
  }

  if (!user) {
    const next = encodeURIComponent(pathname);
    return (
      <Callout tone={tone}>
        <p className="font-medium text-ink">{title}</p>
        <p className="mb-3 mt-1 text-sm text-ink-soft">{description}</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/login?next=${next}`}
            className="rounded-lg border border-rule px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink/30"
          >
            Log In
          </Link>
          <Link
            href={`/signup?next=${next}`}
            className="rounded-lg border border-wine/40 bg-wine/10 px-4 py-2 text-sm font-medium text-wine transition-colors hover:bg-wine/20"
          >
            Sign Up
          </Link>
        </div>
      </Callout>
    );
  }

  return <>{children}</>;
}
