import FAQ from "@/components/homepage/FAQ";
import HeroFunFacts from "@/components/homepage/HeroFunFacts";
import HeroSection from "@/components/homepage/HeroSection";

import TourGuides from "@/components/homepage/TourGuides";
import ToursShowHero from "@/components/homepage/ToursShowHero";
import TravelersSay from "@/components/homepage/TravelersSay";

import WhyChooseUs from "@/components/homepage/WhyChooseUs";
import RoomBookPage from "@/components/hotel/RoomBook";

export default function Home() {
  return (
    <div>
      <HeroSection />

      <ToursShowHero />
      <RoomBookPage></RoomBookPage>
      {/* <HeroSlider /> */}
      <WhyChooseUs />
      <TravelersSay />
      <TourGuides />
      <FAQ />
      <HeroFunFacts />
    </div>
  );
}
