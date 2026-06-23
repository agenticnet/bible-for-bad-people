import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { features, accentStyles } from "@/lib/features";

export default function FeatureGrid() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-neon-cyan">
            The Full Experience
          </p>
          <h2
            className="mb-4 text-3xl font-bold text-bone sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Features for the Faithless
          </h2>
          <p className="mx-auto max-w-2xl text-muted">
            Your complete digital purgatory — all nine features are live. Mock
            mode today; real AI and payments when the APIs arrive.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const styles = accentStyles[feature.accent];
            const Icon = feature.icon;
            const isLive = feature.status === "live";

            const cardContent = (
              <>
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg border ${styles.border} ${styles.bg}`}
                  >
                    <Icon className={`h-5 w-5 ${styles.icon}`} />
                  </div>
                  {isLive ? (
                    <span className="rounded-full border border-neon-gold/40 bg-neon-gold/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-neon-gold">
                      Live
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full border border-ash bg-smoke px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                      <Lock className="h-2.5 w-2.5" />
                      Soon
                    </span>
                  )}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-bone">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
                {isLive && (
                  <div className="mt-4 flex items-center gap-1 text-sm text-neon-gold opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    Try it now
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                )}
              </>
            );

            if (isLive && feature.href) {
              return (
                <Link
                  key={feature.id}
                  href={feature.href}
                  className={`group relative rounded-xl border border-ash bg-shadow p-6 transition-all duration-300 hover:border-ash/80 hover:bg-smoke ${styles.glow}`}
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div
                key={feature.id}
                className={`group relative rounded-xl border border-ash bg-shadow p-6 opacity-80 transition-all duration-300 hover:opacity-100 ${styles.glow}`}
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
