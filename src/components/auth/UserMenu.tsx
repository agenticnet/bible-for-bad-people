"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";

export default function UserMenu() {
  const { user, profile, isLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  if (isLoading) {
    return <span className="text-sm text-binding-muted">...</span>;
  }

  if (!user) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        <Link
          href="/login"
          className="rounded-sm px-3 py-1.5 text-sm text-binding-muted transition-colors hover:text-binding-ivory"
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="rounded-sm border border-ivory/20 px-3 py-1.5 text-sm text-binding-ivory transition-colors hover:border-ivory/35"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  const initial = (profile?.username ?? user.email ?? "?")[0]?.toUpperCase();

  return (
    <div className="relative hidden md:block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-sm border border-ivory/15 px-2 py-1.5 text-sm text-binding-ivory transition-colors hover:border-ivory/30"
        aria-expanded={open}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-wine/20 text-xs font-semibold text-wine">
          {initial}
        </span>
        <span className="max-w-[8rem] truncate">
          {profile ? `u/${profile.username}` : "Set username"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-sm border border-ivory/15 bg-binding-raised py-1 shadow-lg">
          {profile ? (
            <Link
              href={`/u/${profile.username}`}
              className="flex items-center gap-2 px-3 py-2 text-sm text-binding-muted hover:bg-ivory/5 hover:text-binding-ivory"
              onClick={() => setOpen(false)}
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
          ) : (
            <Link
              href="/onboarding?step=claim"
              className="flex items-center gap-2 px-3 py-2 text-sm text-binding-muted hover:bg-ivory/5 hover:text-binding-ivory"
              onClick={() => setOpen(false)}
            >
              <User className="h-4 w-4" />
              Finish your ledger
            </Link>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-binding-muted hover:bg-ivory/5 hover:text-binding-ivory"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
