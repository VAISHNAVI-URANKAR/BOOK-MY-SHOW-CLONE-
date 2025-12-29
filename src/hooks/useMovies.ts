import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Movie {
  id: string;
  title: string;
  poster_url: string;
  banner_url: string | null;
  rating: number;
  duration: string;
  release_date: string | null;
  description: string | null;
  trailer_url: string | null;
  is_featured: boolean;
  is_available: boolean;
  genres: string[];
  languages: string[];
}

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovies();

    // Set up real-time subscription
    const channel = supabase
      .channel('movies-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'movies' },
        () => {
          fetchMovies();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      
      // Fetch movies
      const { data: moviesData, error: moviesError } = await supabase
        .from('movies')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (moviesError) throw moviesError;

      // Fetch genres for all movies
      const { data: genresData, error: genresError } = await supabase
        .from('movie_genres')
        .select('*');

      if (genresError) throw genresError;

      // Fetch languages for all movies
      const { data: languagesData, error: languagesError } = await supabase
        .from('movie_languages')
        .select('*');

      if (languagesError) throw languagesError;

      // Combine the data
      const combinedMovies = (moviesData || []).map(movie => ({
        ...movie,
        genres: (genresData || [])
          .filter(g => g.movie_id === movie.id)
          .map(g => g.genre),
        languages: (languagesData || [])
          .filter(l => l.movie_id === movie.id)
          .map(l => l.language),
      }));

      setMovies(combinedMovies);
      setError(null);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  return { movies, loading, error, refetch: fetchMovies };
}

export function useFeaturedMovies() {
  const { movies, loading, error } = useMovies();
  const featuredMovies = movies.filter(m => m.is_featured);
  return { featuredMovies, loading, error };
}
