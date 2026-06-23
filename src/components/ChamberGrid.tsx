import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { chambers, accentStyles } from "@/lib/chambers";

export default function ChamberGrid() {
  return (
    <section id="chambers" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <h2 className="mb-4 font-serif text-3xl text-ink sm:text-4xl">
            Chambers for the Faithless
          </h2>
          <p className="text-base leading-relaxed text-ink-soft">
            Your complete digital purgatory — all nine chambers stand open. Visions
            approximate today; true prophecy when the APIs arrive.
          </p>
        </div>

        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {chambers.map((chamber) => {
            const styles = accentStyles[chamber.accent];
            const Icon = chamber.icon;
            const isOpen = chamber.status === "live";

            const cardContent = (
              <>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border ${styles.border} ${styles.bg}`}
                  >
                    <Icon className={`h-4 w-4 ${styles.icon}`} />
                  </div>
                  {isOpen ? (
                    <span className="verse-ref rounded-sm border border-wine/25 bg-wine/8 px-2 py-0.5 text-[0.65rem] text-wine">
                      Open
                    </span>
                  ) : (
                    <span className="verse-ref flex items-center gap-1 rounded-sm border border-rule bg-smoke px-2 py-0.5 text-[0.65rem] text-ink-soft">
                      <Lock className="h-2.5 w-2.5" />
                      Sealed
                    </span>
                  )}
                </div>
                <h3 className="mb-2 font-serif text-lg text-ink">{chamber.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">
                  {chamber.description}
                </p>
                {isOpen && (
                  <div className="mt-4 flex items-center gap-1 text-sm text-wine">
                    Enter
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                )}
              </>
            );

            const surfaceClass =
              "group relative bg-page p-6 transition-colors duration-200 hover:bg-smoke";

            if (isOpen && chamber.href) {
              return (
                <Link
                  key={chamber.id}
                  href={chamber.href}
                  className={`${surfaceClass} ${styles.glow}`}
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div
                key={chamber.id}
                className={`${surfaceClass} opacity-75 hover:opacity-100`}
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
