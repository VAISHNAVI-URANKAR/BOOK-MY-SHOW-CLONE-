import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MovieListings from "@/components/MovieListings";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <MovieListings />
        <FeaturedCarousel />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
