import { useState } from "react";
import MovieCard from "./MovieCard";
import { Button } from "@/components/ui/button";

const movies = [
  {
    id: 1,
    title: "Pushpa 2: The Rule",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80",
    rating: 9.1,
    duration: "3h 20min",
    genres: ["Action", "Drama"],
    language: "Telugu",
  },
  {
    id: 2,
    title: "Mufasa: The Lion King",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
    rating: 8.5,
    duration: "2h 10min",
    genres: ["Animation", "Adventure"],
    language: "English",
  },
  {
    id: 3,
    title: "Marco",
    poster: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=400&q=80",
    rating: 8.8,
    duration: "2h 45min",
    genres: ["Action", "Thriller"],
    language: "Malayalam",
  },
  {
    id: 4,
    title: "Baby John",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80",
    rating: 7.9,
    duration: "2h 30min",
    genres: ["Action", "Comedy"],
    language: "Hindi",
  },
  {
    id: 5,
    title: "Viduthalai Part 2",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80",
    rating: 9.0,
    duration: "2h 55min",
    genres: ["Drama", "Thriller"],
    language: "Tamil",
  },
  {
    id: 6,
    title: "UI",
    poster: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80",
    rating: 8.2,
    duration: "2h 15min",
    genres: ["Sci-Fi", "Action"],
    language: "Kannada",
  },
  {
    id: 7,
    title: "Max",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80",
    rating: 8.4,
    duration: "2h 20min",
    genres: ["Action", "Drama"],
    language: "Kannada",
  },
  {
    id: 8,
    title: "Sonic 3",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80",
    rating: 8.0,
    duration: "1h 50min",
    genres: ["Animation", "Action"],
    language: "English",
  },
];

const genres = ["All", "Action", "Drama", "Comedy", "Thriller", "Animation", "Sci-Fi", "Adventure"];

const MovieListings = () => {
  const [selectedGenre, setSelectedGenre] = useState("All");

  const filteredMovies = selectedGenre === "All" 
    ? movies 
    : movies.filter(movie => movie.genres.includes(selectedGenre));

  return (
    <section id="movies" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Now <span className="text-primary">Showing</span>
            </h2>
            <p className="text-muted-foreground">
              Book tickets for the latest blockbusters
            </p>
          </div>
          
          {/* View All Link */}
          <Button variant="ghost" className="text-primary hover:text-primary/80 self-start md:self-auto">
            View All Movies →
          </Button>
        </div>

        {/* Genre Filters */}
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

        {/* Movie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filteredMovies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {filteredMovies.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No movies found in this genre.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieListings;
