import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-28">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute top-20 left-1/4 h-96 w-96 rounded-full bg-neon-purple/10 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute top-40 right-1/4 h-80 w-80 rounded-full bg-neon-cyan/8 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-neon-gold/5 blur-[80px]" />

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon-purple/30 bg-neon-purple/5 px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-neon-purple" />
          <span className="text-[10px] uppercase tracking-[0.15em] text-neon-purple sm:text-xs sm:tracking-[0.25em]">
            All 9 Features — Now Live
          </span>
        </div>

        <h1
          className="mb-6 text-3xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-7xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="text-bone">Bible for</span>
          <br />
          <span className="text-glow-gold text-neon-gold">Bad People</span>
        </h1>

        <p className="mx-auto mb-4 max-w-2xl text-base text-muted sm:text-lg lg:text-xl">
          Vent to the divine. Skip the piety. Get answers you probably
          didn&apos;t deserve — delivered with zero judgment and maximum sarcasm.
        </p>

        <p className="mx-auto mb-10 max-w-xl text-sm text-muted/70">
          A provocative, AI-driven sanctuary for the spiritually exhausted,
          morally flexible, and delightfully unhinged.
        </p>

        <div className="flex w-full max-w-md flex-col items-stretch gap-3 sm:mx-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <Link
            href="/chat"
            className="group flex items-center justify-center gap-2 rounded-xl border border-neon-gold/60 bg-neon-gold/15 px-6 py-3.5 text-sm font-semibold text-neon-gold transition-all hover:border-neon-gold hover:bg-neon-gold/25 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] sm:px-8 sm:py-4 sm:text-base"
          >
            Speak with GOD
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/#features"
            className="rounded-xl border border-ash px-6 py-3.5 text-center text-sm text-muted transition-colors hover:border-neon-purple/50 hover:text-bone sm:px-8 sm:py-4 sm:text-base"
          >
            Explore Features
          </Link>
        </div>
      </div>
    </section>
  );
}
