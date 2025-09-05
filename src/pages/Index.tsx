import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Partnership from "@/components/Partnership";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <main className="w-full">
        <Hero />
        <Services />
        <HowItWorks />
        <Partnership />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
