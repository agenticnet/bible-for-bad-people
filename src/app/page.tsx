import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ChamberGrid from "@/components/ChamberGrid";
import CTASection from "@/components/CTASection";
import LampVignette from "@/components/LampVignette";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="relative">
        <LampVignette />
        <Hero />
        <ChamberGrid />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
