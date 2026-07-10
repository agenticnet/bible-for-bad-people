"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { shouldShowPendingBadge } from "@/lib/ux/pendingTasks";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { TOUCH_TARGET_MIN } from "@/lib/ux/constraints";
import { focusVisibleRingBinding } from "@/components/ui/tokens";
import Spinner from "@/components/ui/Spinner";

export default function UserMenu() {
  const { user, profile, isLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const showBadge = shouldShowPendingBadge(profile);
  const settingsHref = "/settings";

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

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  if (isLoading) {
    return (
      <span className="inline-flex min-h-12 min-w-12 items-center justify-center" role="status">
        <Spinner label="Loading account" className="scale-75" />
      </span>
    );
  }

  if (!user) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        <Link
          href="/login"
          className={cn(
            "inline-flex items-center justify-center rounded-sm px-3 text-sm text-binding-muted transition-colors hover:text-binding-ivory",
            TOUCH_TARGET_MIN,
            focusVisibleRingBinding
          )}
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className={cn(
            "inline-flex items-center justify-center rounded-sm border border-ivory/20 px-3 text-sm text-binding-ivory transition-colors hover:border-ivory/35",
            TOUCH_TARGET_MIN,
            focusVisibleRingBinding
          )}
        >
          Sign Up
        </Link>
      </div>
    );
  }

  const initial = (profile?.username ?? user.email ?? "?")[0]?.toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "relative inline-flex items-center gap-2 rounded-sm border border-ivory/15 px-2 text-sm text-binding-ivory transition-colors hover:border-ivory/30",
          TOUCH_TARGET_MIN,
          focusVisibleRingBinding
        )}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={profile ? `Account menu for ${profile.username}` : "Account menu"}
      >
        <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-wine/20 text-xs font-semibold text-wine">
          {initial}
          {showBadge && (
            <span
              className="absolute -top-0.5 -end-0.5 h-2.5 w-2.5 rounded-full border border-binding bg-wine"
              aria-label="Finish claiming your ledger"
            />
          )}
        </span>
        <span className="hidden max-w-[8rem] truncate sm:inline">
          {profile ? profile.username : "Set username"}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 z-50 mt-2 w-48 rounded-sm border border-ivory/15 bg-binding-raised py-1 shadow-lg"
        >
          {profile ? (
            <Link
              href={`/u/${profile.username}`}
              role="menuitem"
              className="flex min-h-12 items-center gap-2 px-3 text-sm text-binding-muted hover:bg-ivory/5 hover:text-binding-ivory"
              onClick={() => setOpen(false)}
            >
              <User className="h-4 w-4" aria-hidden />
              Profile
            </Link>
          ) : (
            <Link
              href="/onboarding?step=claim"
              role="menuitem"
              className="flex min-h-12 items-center gap-2 px-3 text-sm text-binding-muted hover:bg-ivory/5 hover:text-binding-ivory"
              onClick={() => setOpen(false)}
            >
              <User className="h-4 w-4" aria-hidden />
              Finish your ledger
            </Link>
          )}
          <Link
            href={settingsHref}
            role="menuitem"
            className="flex min-h-12 items-center gap-2 px-3 text-sm text-binding-muted hover:bg-ivory/5 hover:text-binding-ivory"
            onClick={() => setOpen(false)}
          >
            <Settings className="h-4 w-4" aria-hidden />
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="flex min-h-12 w-full items-center gap-2 px-3 text-start text-sm text-binding-muted hover:bg-ivory/5 hover:text-binding-ivory"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
