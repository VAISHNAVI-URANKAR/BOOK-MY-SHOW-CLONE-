import { Play, Star, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturedMovie {
  id: number;
  title: string;
  tagline: string;
  rating: number;
  duration: string;
  releaseDate: string;
  genres: string[];
  image: string;
}

const featuredMovies: FeaturedMovie[] = [
  {
    id: 1,
    title: "Pushpa 2: The Rule",
    tagline: "The Saga Continues",
    rating: 9.1,
    duration: "3h 20min",
    releaseDate: "Dec 5, 2024",
    genres: ["Action", "Drama", "Thriller"],
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80",
  },
];

const HeroSection = () => {
  const movie = featuredMovies[0];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-2xl">
          {/* Featured Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Now Showing</span>
          </div>

          {/* Title */}
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            {movie.title}
          </h1>

          {/* Tagline */}
          <p 
            className="text-xl md:text-2xl text-muted-foreground mb-6 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            {movie.tagline}
          </p>

          {/* Meta Info */}
          <div 
            className="flex flex-wrap items-center gap-4 md:gap-6 mb-8 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="text-foreground font-semibold">{movie.rating}/10</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{movie.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{movie.releaseDate}</span>
            </div>
          </div>

          {/* Genres */}
          <div 
            className="flex flex-wrap gap-2 mb-8 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {movie.genres.map((genre) => (
              <span key={genre} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div 
            className="flex flex-wrap gap-4 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <Button size="lg" className="gap-2 hover-glow">
              <Play className="w-5 h-5" />
              Book Tickets
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              Watch Trailer
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
