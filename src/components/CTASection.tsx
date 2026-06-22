import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="gradient-border relative overflow-hidden p-px">
          <div className="relative rounded-[calc(0.75rem-1px)] bg-shadow px-8 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />
            <p className="relative mb-3 text-xs uppercase tracking-[0.3em] text-neon-pink">
              No Kneeling Required
            </p>
            <h2
              className="relative mb-4 text-3xl font-bold text-bone sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ready to unload your sins?
            </h2>
            <p className="relative mx-auto mb-8 max-w-lg text-muted">
              The confessional is open 24/7. GOD is listening — probably.
              Responses may vary in divine indifference.
            </p>
            <Link
              href="/chat"
              className="relative inline-flex items-center gap-2 rounded-xl border border-neon-purple/60 bg-neon-purple/15 px-8 py-4 text-base font-semibold text-neon-purple transition-all hover:border-neon-purple hover:bg-neon-purple/25 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            >
              Open the Confessional
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
