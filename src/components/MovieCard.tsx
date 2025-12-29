import { Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  duration: string;
  genres: string[];
  language: string;
}

interface MovieCardProps {
  movie: Movie;
  index: number;
}

const MovieCard = ({ movie, index }: MovieCardProps) => {
  return (
    <div 
      className="movie-card group cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="movie-overlay flex flex-col justify-end p-4">
          <Button className="w-full">Book Now</Button>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-semibold text-foreground">{movie.rating}</span>
        </div>

        {/* Language Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-primary/90 text-xs font-medium text-primary-foreground">
          {movie.language}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Clock className="w-3 h-3" />
          <span>{movie.duration}</span>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1.5">
          {movie.genres.slice(0, 2).map((genre) => (
            <span 
              key={genre} 
              className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
