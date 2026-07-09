"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { getLossCopy, type LossContext } from "@/lib/auth/upsellCopy";
import { Callout, Button } from "@/components/ui";

interface AuthGateProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  tone?: "wine" | "plum" | "slate" | "terra" | "ember";
  mode?: "block" | "preview";
  previewFallback?: React.ReactNode;
  lossContext?: LossContext;
  saveLabel?: string;
}

export default function AuthGate({
  children,
  title = "Sign in required",
  description,
  tone = "wine",
  mode = "preview",
  previewFallback,
  lossContext = "generic",
  saveLabel = "Claim your ledger",
}: AuthGateProps) {
  const { user, profile, isLoading } = useAuth();
  const { openSignUp } = useAuthModal();
  const pathname = usePathname();

  const resolvedDescription = description ?? getLossCopy(lossContext);

  if (isLoading) {
    return (
      <Callout tone={tone}>
        <p className="font-medium text-ink">Checking credentials...</p>
        <p className="mt-1 text-sm text-ink-soft">The binding is consulting the ledger.</p>
      </Callout>
    );
  }

  if (!user) {
    if (mode === "preview") {
      return <>{children}</>;
    }

    const next = encodeURIComponent(pathname);
    return (
      <Callout tone={tone}>
        <p className="font-medium text-ink">{title}</p>
        <p className="mb-3 mt-1 text-sm text-ink-soft">{resolvedDescription}</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/login?next=${next}`}
            className="rounded-lg border border-rule px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink/30"
          >
            Log In
          </Link>
          <Button
            type="button"
            accent="wine"
            size="sm"
            onClick={() => openSignUp(lossContext, pathname)}
          >
            {saveLabel}
          </Button>
        </div>
        {previewFallback}
      </Callout>
    );
  }

  if (!profile) {
    const next = encodeURIComponent(pathname);
    return (
      <Callout tone={tone}>
        <p className="font-medium text-ink">Finish claiming your ledger</p>
        <p className="mb-3 mt-1 text-sm text-ink-soft">
          Complete your ledger before saving chamber data.
        </p>
        <Link
          href={`/onboarding?step=claim&next=${next}`}
          className="inline-block rounded-lg border border-wine/40 bg-wine/10 px-4 py-2 text-sm font-medium text-wine transition-colors hover:bg-wine/20"
        >
          Claim your ledger
        </Link>
      </Callout>
    );
  }

  return <>{children}</>;
}

export function AuthSavePrompt({
  lossContext,
  label,
  className,
}: {
  lossContext: LossContext;
  label?: string;
  className?: string;
}) {
  const { openSignUp } = useAuthModal();
  const pathname = usePathname();

  return (
    <div className={className}>
      <p className="mb-3 text-sm text-ink-soft">{getLossCopy(lossContext)}</p>
      <Button
        type="button"
        accent="wine"
        size="sm"
        onClick={() => openSignUp(lossContext, pathname)}
      >
        {label ?? "Claim your ledger"}
      </Button>
    </div>
  );
}
