import Ruler from "@/components/Ruler";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Runway from "@/components/Runway";
import MadeToMeasure from "@/components/MadeToMeasure";
import Arquivo from "@/components/Arquivo";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Ruler />
      <Nav />
      <Hero />
      <Ticker />
      <Runway />
      <MadeToMeasure />
      <Arquivo />
      <Footer />
    </main>
  );
}
