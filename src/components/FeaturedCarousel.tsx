import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const featuredShows = [
  {
    id: 1,
    title: "Coldplay: Music Of The Spheres",
    type: "Live Concert",
    date: "Jan 18-19, 2025",
    venue: "DY Patil Stadium, Mumbai",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80",
    rating: 9.5,
  },
  {
    id: 2,
    title: "Diljit Dosanjh Live",
    type: "Music Concert",
    date: "Feb 15, 2025",
    venue: "JLN Stadium, Delhi",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    rating: 9.2,
  },
  {
    id: 3,
    title: "Comedy Nights",
    type: "Stand-up Comedy",
    date: "Every Weekend",
    venue: "Multiple Venues",
    image: "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800&q=80",
    rating: 8.8,
  },
];

const FeaturedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredShows.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredShows.length) % featuredShows.length);
  };

  return (
    <section className="py-16 md:py-24 hero-gradient">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured <span className="text-primary">Events</span>
            </h2>
            <p className="text-muted-foreground">
              Don't miss out on the hottest shows
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden sm:flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevSlide}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextSlide}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden rounded-2xl">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {featuredShows.map((show) => (
              <div 
                key={show.id} 
                className="w-full flex-shrink-0"
              >
                <div className="relative aspect-[21/9] md:aspect-[21/7] overflow-hidden rounded-2xl group cursor-pointer">
                  <img
                    src={show.image}
                    alt={show.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="p-6 md:p-12 max-w-xl">
                      {/* Type Badge */}
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-4">
                        {show.type}
                      </span>
                      
                      <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
                        {show.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-muted-foreground mb-4">
                        <span>{show.date}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                        <span>{show.venue}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-foreground font-semibold">{show.rating}</span>
                        </div>
                        <Button className="hover-glow">Book Now</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {featuredShows.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "w-8 bg-primary" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCarousel;
