import Link from "next/link";
import { Cross } from "lucide-react";
import { featureNavGroups } from "@/lib/navigation";

export default function Footer() {
  return (
    <footer className="border-t border-ash/50 bg-abyss">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Explore grid */}
        <div className="mb-10">
          <p className="mb-6 text-center text-xs uppercase tracking-[0.3em] text-neon-purple sm:text-left">
            Explore the App
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featureNavGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-3 text-sm font-semibold text-bone">{group.title}</h3>
                <ul className="flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group block rounded-lg px-2 py-1.5 -mx-2 transition-colors hover:bg-smoke"
                      >
                        <span className="text-sm text-muted transition-colors group-hover:text-neon-cyan">
                          {link.label}
                        </span>
                        {link.description && (
                          <span className="mt-0.5 block text-[11px] text-muted/50">
                            {link.description}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-ash/50 pt-8 sm:flex-row sm:gap-6">
          <div className="flex items-center gap-2.5">
            <Cross className="h-4 w-4 rotate-45 text-neon-purple/60" />
            <span className="text-sm text-muted">
              Bible for Bad People &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
            <Link
              href="/#features"
              className="text-xs text-muted/70 transition-colors hover:text-bone"
            >
              Features
            </Link>
            <Link
              href="/chat"
              className="text-xs text-muted/70 transition-colors hover:text-bone"
            >
              Speak with GOD
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted/60 sm:text-right">
          Not affiliated with any deity, denomination, or eternal damnation service.
          For entertainment purposes only. Your soul is your own problem.
        </p>
      </div>
    </footer>
  );
}
