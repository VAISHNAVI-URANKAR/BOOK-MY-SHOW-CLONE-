import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/hooks/useBookings';
import { Movie } from '@/hooks/useMovies';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users, CreditCard, Loader2, CheckCircle } from 'lucide-react';

interface BookingModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

const TICKET_PRICE = 250; // Price per ticket
const SHOW_TIMES = ['10:00 AM', '1:30 PM', '5:00 PM', '8:30 PM', '11:00 PM'];

const BookingModal = ({ movie, isOpen, onClose }: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState('');
  const [seats, setSeats] = useState(1);
  const [step, setStep] = useState<'select' | 'payment' | 'success'>('select');
  
  const { user } = useAuth();
  const { createBooking, processPayment, loading } = useBookings();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Generate next 7 days for date selection
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const totalAmount = seats * TICKET_PRICE;

  const handleProceedToPayment = async () => {
    if (!user) {
      toast({
        title: 'Sign In Required',
        description: 'Please sign in to book tickets.',
        variant: 'destructive',
      });
      onClose();
      navigate('/auth');
      return;
    }

    if (!selectedTime) {
      toast({
        title: 'Select Show Time',
        description: 'Please select a show time.',
        variant: 'destructive',
      });
      return;
    }

    setStep('payment');

    const showDate = format(dates[selectedDate], 'yyyy-MM-dd');
    
    // Generate seat labels like A1, A2, etc. based on number of seats
    const seatLabels = Array.from({ length: seats }, (_, i) => `A${i + 1}`);
    
    const { success, bookingId } = await createBooking({
      movieId: movie.id,
      movieTitle: movie.title,
      showDate,
      showTime: selectedTime,
      seats: seatLabels,
      totalAmount,
    });

    if (success && bookingId) {
      // Process mock payment
      const paymentResult = await processPayment(bookingId, movie.title);
      
      if (paymentResult.success) {
        setStep('success');
      } else {
        setStep('select');
      }
    } else {
      setStep('select');
    }
  };

  const handleClose = () => {
    setStep('select');
    setSelectedTime('');
    setSeats(1);
    setSelectedDate(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">
            {step === 'success' ? 'Booking Confirmed!' : `Book Tickets - ${movie.title}`}
          </DialogTitle>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-6 mt-4">
            {/* Date Selection */}
            <div className="space-y-3">
              <Label className="text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Select Date
              </Label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(index)}
                    className={`flex flex-col items-center min-w-[4.5rem] p-3 rounded-lg border transition-all ${
                      selectedDate === index
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-secondary text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    <span className="text-xs font-medium">{format(date, 'EEE')}</span>
                    <span className="text-lg font-bold">{format(date, 'd')}</span>
                    <span className="text-xs">{format(date, 'MMM')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="space-y-3">
              <Label className="text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Select Show Time
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {SHOW_TIMES.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      selectedTime === time
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-secondary text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Seats Selection */}
            <div className="space-y-3">
              <Label className="text-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Number of Seats
              </Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                  disabled={seats <= 1}
                >
                  -
                </Button>
                <span className="text-2xl font-bold text-foreground w-8 text-center">{seats}</span>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setSeats(Math.min(10, seats + 1))}
                  disabled={seats >= 10}
                >
                  +
                </Button>
                <span className="text-muted-foreground ml-4">
                  ₹{TICKET_PRICE} × {seats} = <span className="text-foreground font-semibold">₹{totalAmount}</span>
                </span>
              </div>
            </div>

            {/* Proceed Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleProceedToPayment}
              disabled={!selectedTime}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Proceed to Pay ₹{totalAmount}
            </Button>
          </div>
        )}

        {step === 'payment' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-lg font-medium text-foreground">Processing Payment...</p>
            <p className="text-muted-foreground text-sm">Please wait while we confirm your booking</p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Booking Successful!</h3>
            <div className="text-center space-y-1">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{movie.title}</span>
              </p>
              <p className="text-muted-foreground">
                {format(dates[selectedDate], 'EEEE, MMMM d')} at {selectedTime}
              </p>
              <p className="text-muted-foreground">{seats} Ticket(s) • ₹{totalAmount}</p>
            </div>
            <Button className="mt-4" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
