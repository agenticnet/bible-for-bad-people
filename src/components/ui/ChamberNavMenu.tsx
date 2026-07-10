"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { chamberNavGroups } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { TOUCH_TARGET_MIN } from "@/lib/ux/constraints";
import { focusVisibleRingBinding } from "./tokens";

export default function ChamberNavMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="relative" ref={menuRef}>
      <Link
        href="/#chambers"
        className={cn(
          "hidden items-center justify-center rounded-sm border border-ivory/15 px-3 text-sm text-binding-muted transition-colors hover:border-ivory/30 hover:text-binding-ivory md:inline-flex",
          TOUCH_TARGET_MIN,
          focusVisibleRingBinding
        )}
      >
        Chambers
      </Link>

      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-sm border border-ivory/15 text-binding-muted md:hidden",
          TOUCH_TARGET_MIN,
          focusVisibleRingBinding
        )}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chamber menu" : "Open chamber menu"}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute top-full end-0 z-50 mt-2 max-h-[70dvh] w-72 overflow-y-auto",
            "rounded-sm border border-ivory/15 bg-binding-raised py-2 shadow-lg md:hidden"
          )}
        >
          {chamberNavGroups.map((group) => (
            <div key={group.title} className="border-t border-ivory/10 px-2 py-2 first:border-t-0">
              <p className="verse-ref mb-1 px-2 text-[0.65rem] text-binding-muted">
                {group.title}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    className="inline-flex min-h-12 items-center rounded-sm px-2 text-sm text-binding-muted transition-colors hover:bg-ivory/5 hover:text-binding-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory/40"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
