import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
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

