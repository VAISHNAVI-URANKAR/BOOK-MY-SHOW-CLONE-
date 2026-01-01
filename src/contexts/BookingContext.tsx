import { createContext, useContext, useState, ReactNode } from 'react';
import { Movie } from '@/hooks/useMovies';

interface BookingDetails {
  movie: Movie;
  showDate: string;
  showTime: string;
  seats: string[];
  totalAmount: number;
}

interface BookingContextType {
  bookingDetails: BookingDetails | null;
  setBookingDetails: (details: BookingDetails | null) => void;
  clearBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  const clearBooking = () => setBookingDetails(null);

  return (
    <BookingContext.Provider value={{ bookingDetails, setBookingDetails, clearBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingContext() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
}
