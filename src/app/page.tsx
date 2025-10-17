import FAQ from "@/components/homepage/FAQ";
import HeroSection from "@/components/homepage/Hero";
import HeroSlider from "@/components/homepage/HeroSlider";
import TourGuides from "@/components/homepage/TourGuides";
import TravelersSay from "@/components/homepage/TravelersSay";
import TravellerForm from "@/components/homepage/TravellerForm";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <HeroSlider />
      <WhyChooseUs />
      <TravelersSay />
      <TourGuides />
      <FAQ />
      <TravellerForm />
    </div>
  );
}
