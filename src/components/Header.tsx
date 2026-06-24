"use client";

import Link from "next/link";
import { Cross, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { primaryNavLinks, chamberNavGroups } from "@/lib/navigation";
import UserMenu from "@/components/auth/UserMenu";
import { useAuth } from "@/components/auth/AuthProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  resolveTransition,
  resolveVariants,
  slideDown,
  transition,
} from "@/lib/motion";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const reducedMotion = useReducedMotion();
  const headerVariants = resolveVariants(slideDown, reducedMotion);
  const headerT = resolveTransition(
    { ...transition.base, duration: 0.4 },
    reducedMotion
  );

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <motion.header
      className="fixed top-0 right-0 left-0 z-50 border-b border-ivory/10 bg-binding"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      transition={headerT}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5">
        <Link href="/" className="group flex min-w-0 shrink items-center gap-2.5 sm:gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-ivory/20 bg-binding-raised transition-colors group-hover:border-ivory/35 sm:h-9 sm:w-9">
            <Cross className="h-3.5 w-3.5 rotate-45 text-ivory sm:h-4 sm:w-4" />
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

        <nav className="hidden items-center gap-6 md:flex">
          {primaryNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm text-binding-muted transition-colors hover:text-binding-ivory"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <UserMenu />
          <button
            type="button"
            className="shrink-0 rounded-sm border border-ivory/15 p-2 text-binding-muted md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            key="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={
              reducedMotion
                ? { duration: 0.01 }
                : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
            }
            className="overflow-hidden border-t border-ivory/10 bg-binding-raised md:hidden"
          >
            <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto px-4 py-4">
              <div className="mb-4 flex flex-col gap-1">
                {primaryNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-sm px-3 py-2.5 text-sm font-medium text-binding-ivory transition-colors hover:bg-ivory/5"
                    onClick={closeMobile}
                  >
                    {link.label}
                  </Link>
                ))}
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
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
