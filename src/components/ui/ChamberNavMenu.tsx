"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { chamberNavGroups } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { TOUCH_TARGET_MIN } from "@/lib/ux/constraints";
import { focusVisibleRingBinding } from "./tokens";

interface ChamberNavMenuProps {
  /** Desktop trigger style: button dropdown (header) or compact (binding bar). */
  variant?: "header" | "binding";
}

export default function ChamberNavMenu({ variant = "binding" }: ChamberNavMenuProps) {
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

  const isHeader = variant === "header";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className={cn(
          "items-center justify-center rounded-sm text-binding-muted transition-colors hover:text-binding-ivory",
          TOUCH_TARGET_MIN,
          focusVisibleRingBinding,
          isHeader
            ? "hidden gap-1.5 px-1 text-sm md:inline-flex"
            : "hidden gap-1.5 border border-ivory/15 px-3 text-sm hover:border-ivory/30 md:inline-flex"
        )}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chamber menu" : "Open chamber menu"}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Chambers
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

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
            "absolute top-full z-50 mt-2 max-h-[70dvh] w-72 overflow-y-auto",
            "rounded-sm border border-ivory/15 bg-binding-raised py-2 shadow-lg",
            isHeader ? "start-0" : "end-0"
          )}
        >
          <Link
            href="/#chambers"
            role="menuitem"
            className="mx-2 mb-2 flex min-h-12 items-center rounded-sm border-b border-ivory/10 px-2 pb-2 text-sm font-medium text-binding-ivory transition-colors hover:bg-ivory/5"
            onClick={closeMenu}
          >
            All chambers
          </Link>
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
