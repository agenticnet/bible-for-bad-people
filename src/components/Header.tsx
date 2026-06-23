"use client";

import Link from "next/link";
import { Cross, Menu, X } from "lucide-react";
import { useState } from "react";
import { primaryNavLinks, featureNavGroups } from "@/lib/navigation";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-ash/50 bg-void/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="group flex min-w-0 shrink items-center gap-2 sm:gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neon-purple/40 bg-neon-purple/10 transition-colors group-hover:border-neon-purple/70 sm:h-9 sm:w-9">
            <Cross className="h-3.5 w-3.5 rotate-45 text-neon-purple sm:h-4 sm:w-4" />
          </div>
          <div className="min-w-0 flex flex-col leading-none">
            <span className="truncate text-xs font-semibold tracking-wide text-bone sm:text-sm">
              Bible for Bad People
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted sm:block">
              Salvation Optional
            </span>
          </div>
        </Link>

        {/* Desktop — minimal */}
        <nav className="hidden items-center gap-6 lg:flex">
          {primaryNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm text-muted transition-colors hover:text-neon-cyan"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/chat"
            className="whitespace-nowrap rounded-lg border border-neon-gold/50 bg-neon-gold/10 px-4 py-2 text-sm font-medium text-neon-gold transition-all hover:border-neon-gold hover:bg-neon-gold/20 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]"
          >
            Enter the Confessional
          </Link>
        </nav>

        {/* Tablet — CTA only */}
        <div className="hidden items-center gap-3 md:flex lg:hidden">
          <Link
            href="/#features"
            className="text-sm text-muted transition-colors hover:text-neon-cyan"
          >
            Features
          </Link>
          <Link
            href="/chat"
            className="rounded-lg border border-neon-gold/50 bg-neon-gold/10 px-3 py-1.5 text-sm font-medium text-neon-gold transition-all hover:border-neon-gold hover:bg-neon-gold/20"
          >
            Confessional
          </Link>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-lg border border-ash p-2 text-muted md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu — grouped, scrollable */}
      {mobileOpen && (
        <nav className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-ash/50 bg-abyss md:hidden">
          <div className="px-4 py-4">
            <div className="mb-4 flex flex-col gap-2">
              {primaryNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-bone transition-colors hover:bg-smoke"
                  onClick={closeMobile}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/chat"
                className="rounded-lg border border-neon-gold/50 bg-neon-gold/10 px-3 py-2.5 text-center text-sm font-medium text-neon-gold"
                onClick={closeMobile}
              >
                Enter the Confessional
              </Link>
            </div>

            {featureNavGroups.map((group) => (
              <div key={group.title} className="mb-4 border-t border-ash/50 pt-4">
                <p className="mb-2 px-3 text-[10px] uppercase tracking-[0.2em] text-muted">
                  {group.title}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-smoke hover:text-bone"
                      onClick={closeMobile}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <p className="px-3 pt-2 text-center text-[10px] text-muted/50">
              All features also listed in the footer
            </p>
          </div>
        </nav>
      )}
    </header>
  );
}
