"use client";

import Link from "next/link";
import { Cross, Menu, X } from "lucide-react";
import { useState } from "react";
import { chamberNavGroups } from "@/lib/navigation";
import UserMenu from "@/components/auth/UserMenu";
import { useAuth } from "@/components/auth/AuthProvider";
import { ChamberNavMenu } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ivory/10 bg-binding">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5">
        <Link href="/" className="group flex min-w-0 shrink items-center gap-2.5 sm:gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-ivory/20 bg-binding-raised transition-colors group-hover:border-ivory/35 sm:h-9 sm:w-9">
            <Cross className="h-3.5 w-3.5 rotate-45 text-ivory sm:h-4 sm:w-4" aria-hidden />
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-serif text-sm text-binding-ivory sm:text-base">
              Bible for Bad People
            </span>
            <span className="verse-ref hidden text-[0.65rem] text-binding-muted sm:block">
              Salvation optional
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          <ChamberNavMenu variant="header" />
        </nav>

        <div className="flex min-w-0 shrink-0 items-center gap-3">
          <UserMenu />
          <button
            type="button"
            className="inline-flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-sm border border-ivory/15 text-binding-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory/40 focus-visible:ring-offset-2 focus-visible:ring-offset-binding md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      <nav
        className={cn(
          "grid overflow-hidden border-t border-ivory/10 bg-binding-raised transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none md:hidden",
          mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
        aria-hidden={!mobileOpen}
      >
        <div className={cn("min-h-0", !mobileOpen && "invisible")} inert={!mobileOpen}>
          <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto px-4 py-4">
            <div className="mb-4 flex flex-col gap-1">
              <Link
                href="/#chambers"
                className="rounded-sm px-3 py-2.5 text-sm font-medium text-binding-ivory transition-colors hover:bg-ivory/5"
                onClick={closeMobile}
              >
                All chambers
              </Link>
            </div>

            {!user && (
              <div className="mb-4 flex gap-2 border-t border-ivory/10 pt-4">
                <Link
                  href="/login"
                  className="flex-1 rounded-sm border border-ivory/15 px-3 py-2 text-center text-sm text-binding-muted"
                  onClick={closeMobile}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 rounded-sm border border-ivory/20 bg-ivory/5 px-3 py-2 text-center text-sm text-binding-ivory"
                  onClick={closeMobile}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {chamberNavGroups.map((group) => (
              <div key={group.title} className="mb-4 border-t border-ivory/10 pt-4">
                <p className="verse-ref mb-2 px-3 text-[0.65rem] text-binding-muted">
                  {group.title}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-sm px-3 py-2 text-sm text-binding-muted transition-colors hover:bg-ivory/5 hover:text-binding-ivory"
                      onClick={closeMobile}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
