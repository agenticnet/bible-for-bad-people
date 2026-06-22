import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import CTASection from "@/components/CTASection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="relative">
        <Hero />
        <FeatureGrid />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
