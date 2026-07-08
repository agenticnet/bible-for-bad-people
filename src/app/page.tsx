import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ChamberGrid from "@/components/ChamberGrid";
import CTASection from "@/components/CTASection";
import LampVignette from "@/components/LampVignette";
import { PendingTasks } from "@/components/ui";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="relative">
        <LampVignette />
        <Hero />
        <section className="px-4 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <PendingTasks className="mb-8" />
          </div>
        </section>
        <ChamberGrid />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
