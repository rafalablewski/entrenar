import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Structure from "@/components/Structure";
import Ventures from "@/components/Ventures";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Structure />
        <Ventures />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
