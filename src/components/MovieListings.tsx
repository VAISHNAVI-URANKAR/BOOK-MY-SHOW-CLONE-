import { useState } from "react";
import MovieCard from "./MovieCard";
import { Button } from "@/components/ui/button";
import { useMovies } from "@/hooks/useMovies";
import { Loader2 } from "lucide-react";

const genres = ["All", "Action", "Drama", "Comedy", "Thriller", "Animation", "Sci-Fi", "Adventure"];

const MovieListings = () => {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const { movies, loading, error } = useMovies();

  const filteredMovies = selectedGenre === "All" 
    ? movies 
    : movies.filter(movie => movie.genres.includes(selectedGenre));

  return (
    <section id="movies" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Now <span className="text-primary">Showing</span>
            </h2>
            <p className="text-muted-foreground">Book tickets for the latest blockbusters</p>
          </div>
          <Button variant="ghost" className="text-primary hover:text-primary/80 self-start md:self-auto">
            View All Movies →
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {genres.map((genre) => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedGenre(genre)}
              className="whitespace-nowrap shrink-0"
            >
              {genre}
            </Button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredMovies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>
        )}

        {!loading && !error && filteredMovies.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No movies found in this genre.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieListings;
