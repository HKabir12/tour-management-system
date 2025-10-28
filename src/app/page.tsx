import FAQ from "@/components/homepage/FAQ";
import HeroSection from "@/components/homepage/HeroSection";

import TourGuides from "@/components/homepage/TourGuides";
import TravelersSay from "@/components/homepage/TravelersSay";
import TravellerForm from "@/components/homepage/TravellerForm";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";

export default function Home() {
  return (
    <div>
      <HeroSection></HeroSection>

      {/* <HeroSlider /> */}
      <WhyChooseUs />
      <TravelersSay />
      <TourGuides />
      <FAQ />
      <TravellerForm />
    </div>
  );
}
