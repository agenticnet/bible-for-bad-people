"use client";

import Link from "next/link";
import { Cross, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/chat", label: "Speak with GOD" },
  { href: "/support-desk", label: "Support Desk" },
  { href: "/devils-advocate", label: "Lucifer" },
  { href: "/oracle", label: "Oracle" },
  { href: "/cynics-bible", label: "TL;DR Bible" },
  { href: "/sin-translator", label: "Sin Engine" },
  { href: "/indulgences", label: "Indulgences" },
  { href: "/smite", label: "Smite" },
  { href: "/confessional", label: "Confessional" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-ash/50 bg-void/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-neon-purple/40 bg-neon-purple/10 transition-colors group-hover:border-neon-purple/70">
            <Cross className="h-4 w-4 rotate-45 text-neon-purple" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-wide text-bone">
              Bible for Bad People
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
              Salvation Optional
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-neon-cyan"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/chat"
            className="rounded-lg border border-neon-gold/50 bg-neon-gold/10 px-4 py-2 text-sm font-medium text-neon-gold transition-all hover:border-neon-gold hover:bg-neon-gold/20 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]"
          >
            Enter the Confessional
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-lg border border-ash p-2 text-muted md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-ash/50 bg-abyss px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm text-muted transition-colors hover:text-neon-cyan"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/chat"
              className="mt-2 rounded-lg border border-neon-gold/50 bg-neon-gold/10 px-4 py-3 text-center text-sm font-medium text-neon-gold"
              onClick={() => setMobileOpen(false)}
            >
              Enter the Confessional
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
