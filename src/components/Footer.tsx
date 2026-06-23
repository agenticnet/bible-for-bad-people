import Link from "next/link";
import { Cross } from "lucide-react";
import { chamberNavGroups } from "@/lib/navigation";

export default function Footer() {
  return (
    <footer className="border-t border-ivory/10 bg-binding">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10">
          <h2 className="mb-6 font-serif text-lg text-binding-ivory sm:text-xl">
            Wander the Chambers
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {chamberNavGroups.map((group) => (
              <div key={group.title}>
                <h3 className="verse-ref mb-3 text-[0.7rem] text-binding-muted">
                  {group.title}
                </h3>
                <ul className="flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group block rounded-sm px-2 py-1.5 -mx-2 transition-colors hover:bg-ivory/5"
                      >
                        <span className="text-sm text-binding-muted transition-colors group-hover:text-binding-ivory">
                          {link.label}
                        </span>
                        {link.description && (
                          <span className="mt-0.5 block text-[11px] leading-relaxed text-binding-muted/70">
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

        <div className="flex flex-col items-center justify-between gap-4 border-t border-ivory/10 pt-8 sm:flex-row sm:gap-6">
          <div className="flex items-center gap-2.5">
            <Cross className="h-4 w-4 rotate-45 text-binding-muted" />
            <span className="text-sm text-binding-muted">
              Bible for Bad People &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
            <Link
              href="/#chambers"
              className="text-xs text-binding-muted transition-colors hover:text-binding-ivory"
            >
              The Chambers
            </Link>
            <Link
              href="/chat"
              className="text-xs text-binding-muted transition-colors hover:text-binding-ivory"
            >
              Speak with GOD
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-binding-muted/80 sm:text-right">
          Not affiliated with any deity, denomination, or eternal damnation service.
          For entertainment purposes only. Your soul is your own problem.
        </p>
      </div>
    </footer>
  );
}
