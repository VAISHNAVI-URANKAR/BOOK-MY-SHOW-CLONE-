import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CreateBookingParams {
  movieId: string;
  movieTitle: string;
  showDate: string;
  showTime: string;
  seats: number;
  totalAmount: number;
}

export function useBookings() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createBooking = async ({
    movieId,
    movieTitle,
    showDate,
    showTime,
    seats,
    totalAmount,
  }: CreateBookingParams) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to book tickets.',
        variant: 'destructive',
      });
      return { success: false, bookingId: null };
    }

    setLoading(true);

    try {
      // Create booking with pending payment status
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          movie_id: movieId,
          show_date: showDate,
          show_time: showTime,
          seats,
          total_amount: totalAmount,
          payment_status: 'pending',
          booking_status: 'confirmed',
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      return { success: true, bookingId: booking.id };
    } catch (err) {
      console.error('Error creating booking:', err);
      toast({
        title: 'Booking Failed',
        description: 'Failed to create booking. Please try again.',
        variant: 'destructive',
      });
      return { success: false, bookingId: null };
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (bookingId: string, movieTitle: string) => {
    setLoading(true);

    try {
      // Simulate payment processing delay (2-3 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

      // Update booking status to paid
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ payment_status: 'paid' })
        .eq('id', bookingId);

      if (updateError) throw updateError;

      // Mock email notification - show as toast
      toast({
        title: '📧 Confirmation Email Sent!',
        description: `Your booking for "${movieTitle}" has been confirmed. Check your inbox for details.`,
      });

      return { success: true };
    } catch (err) {
      console.error('Error processing payment:', err);
      
      // Update booking status to failed
      await supabase
        .from('bookings')
        .update({ payment_status: 'failed' })
        .eq('id', bookingId);

      toast({
        title: 'Payment Failed',
        description: 'Payment processing failed. Please try again.',
        variant: 'destructive',
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, processPayment, loading };
}
