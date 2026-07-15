import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BrandSlider from "@/components/BrandSlider";
import Services from "@/components/Services";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import About from "@/components/About";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        <Hero />
        <BrandSlider />
        <Services />
        <BeforeAfterSection />
        <About />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

