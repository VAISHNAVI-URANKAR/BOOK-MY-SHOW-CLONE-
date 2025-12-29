import { useState } from 'react';
import { Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie } from '@/hooks/useMovies';
import BookingModal from './BookingModal';

interface MovieCardProps {
  movie: Movie;
  index: number;
}

const MovieCard = ({ movie, index }: MovieCardProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <div 
        className="movie-card group cursor-pointer"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          <div className="movie-overlay flex flex-col justify-end p-4">
            <Button className="w-full" onClick={() => setIsBookingOpen(true)}>Book Now</Button>
          </div>

          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-semibold text-foreground">{movie.rating}</span>
          </div>

          {movie.languages[0] && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-primary/90 text-xs font-medium text-primary-foreground">
              {movie.languages[0]}
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Clock className="w-3 h-3" />
            <span>{movie.duration}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {movie.genres.slice(0, 2).map((genre) => (
              <span key={genre} className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>

      <BookingModal movie={movie} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
};

export default MovieCard;
