import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useBookingContext } from '@/contexts/BookingContext';
import { Movie } from '@/hooks/useMovies';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users } from 'lucide-react';

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
  
  const { user } = useAuth();
  const { setBookingDetails } = useBookingContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Generate next 7 days for date selection
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const totalAmount = seats * TICKET_PRICE;

  const handleProceedToPayment = () => {
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

    const showDate = format(dates[selectedDate], 'yyyy-MM-dd');
    const seatLabels = Array.from({ length: seats }, (_, i) => `A${i + 1}`);

    // Set booking details in context
    setBookingDetails({
      movie,
      showDate,
      showTime: selectedTime,
      seats: seatLabels,
      totalAmount,
    });

    // Close modal and navigate to payment page
    onClose();
    navigate('/payment');
  };

  const handleClose = () => {
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
            Book Tickets - {movie.title}
          </DialogTitle>
        </DialogHeader>

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
            Proceed to Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
