import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="page-enter border-b border-rule px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="verse-ref mb-6 text-ink-soft">Est. whenever guilt became optional</p>

        <h1 className="mb-6 font-serif text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.08] font-normal tracking-[-0.02em] text-ink">
          Bible for
          <br />
          <span className="text-wine">Bad People</span>
        </h1>

        <p className="mx-auto mb-4 max-w-xl text-lg leading-relaxed text-ink-soft">
          Vent to the divine. Skip the piety. Get answers you probably
          didn&apos;t deserve — delivered with zero judgment and maximum sarcasm.
        </p>

        <p className="mx-auto mb-10 max-w-lg text-sm leading-relaxed text-ink-soft">
          A provocative sanctuary for the spiritually exhausted, morally flexible,
          and delightfully unhinged.
        </p>

        <div className="flex w-full max-w-md flex-col items-stretch gap-3 sm:mx-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <Link
            href="/chat"
            className="group inline-flex items-center justify-center gap-2 rounded-md bg-wine px-6 py-3.5 text-sm font-medium text-ivory transition-colors hover:bg-wine-deep sm:px-8 sm:py-4 sm:text-base"
          >
            Speak with GOD
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/#chambers"
            className="rounded-md border border-rule bg-page px-6 py-3.5 text-center text-sm text-ink-soft transition-colors hover:border-ink-soft/30 hover:text-ink sm:px-8 sm:py-4 sm:text-base"
          >
            Explore the Chambers
          </Link>
        </div>
      </div>
    </section>
  );
}
