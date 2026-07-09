"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Callout, LinkButton } from "@/components/ui";
import { markWelcomeComplete } from "@/lib/ux/welcome";

interface PostSignupWelcomeProps {
  active: boolean;
  cardsRevealed: boolean;
}

export default function PostSignupWelcome({ active, cardsRevealed }: PostSignupWelcomeProps) {
  useEffect(() => {
    if (active && cardsRevealed) {
      markWelcomeComplete();
    }
  }, [active, cardsRevealed]);

  if (!active) return null;

  if (!cardsRevealed) {
    return (
      <Callout tone="plum" className="mb-8">
        <p className="font-medium text-ink">Your ledger is claimed.</p>
        <p className="mt-1 text-sm text-ink-soft">
          Let&apos;s see what doom awaits you today. Hit the button below to reveal
          your daily spread.
        </p>
      </Callout>
    );
  }

  return (
    <Callout tone="wine" className="mb-8">
      <p className="font-medium text-ink">The cards have spoken.</p>
      <p className="mt-1 mb-4 text-sm text-ink-soft">
        Your salvation score is looking thin. Browse the marketplace and stock up
        on indulgences.
      </p>
      <LinkButton href="/indulgences" className="w-full sm:w-auto">
        Browse indulgences
      </LinkButton>
      <p className="mt-3 text-xs text-ink-soft">
        <Link href="/" className="text-wine hover:underline">
          Or explore chambers on your own
        </Link>
      </p>
    </Callout>
  );
}
