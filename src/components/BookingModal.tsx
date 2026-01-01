import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useBookingContext } from '@/contexts/BookingContext';
import { Movie } from '@/hooks/useMovies';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Users, MapPin } from 'lucide-react';

interface BookingModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

interface Hall {
  id: string;
  name: string;
  location: string;
  showtimes: string[];
}

const TICKET_PRICE = 250;

// Mock halls data - in production this would come from the database
const HALLS: Hall[] = [
  {
    id: '1',
    name: 'PVR Cinemas',
    location: 'Phoenix Mall, Kurla',
    showtimes: ['10:00 AM', '1:30 PM', '5:00 PM', '8:30 PM', '11:00 PM'],
  },
  {
    id: '2',
    name: 'INOX',
    location: 'R-City Mall, Ghatkopar',
    showtimes: ['9:30 AM', '12:45 PM', '4:15 PM', '7:45 PM', '10:30 PM'],
  },
  {
    id: '3',
    name: 'Cinepolis',
    location: 'Viviana Mall, Thane',
    showtimes: ['11:00 AM', '2:30 PM', '6:00 PM', '9:15 PM'],
  },
  {
    id: '4',
    name: 'Carnival Cinemas',
    location: 'Imax Wadala',
    showtimes: ['10:30 AM', '1:45 PM', '5:30 PM', '8:45 PM', '11:30 PM'],
  },
];

const BookingModal = ({ movie, isOpen, onClose }: BookingModalProps) => {
  const [seats, setSeats] = useState(1);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { setBookingDetails } = useBookingContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Generate next 14 days for date selection
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  const totalAmount = seats * TICKET_PRICE;

  const handleDateSelect = (index: number) => {
    setSelectedDate(index);
    setSelectedHall(null);
    setSelectedTime(null);
  };

  const handleTimeSelect = (hallId: string, time: string) => {
    setSelectedHall(hallId);
    setSelectedTime(time);
  };

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

    if (selectedDate === null || !selectedTime || !selectedHall) {
      toast({
        title: 'Complete Selection',
        description: 'Please select date, hall, and showtime.',
        variant: 'destructive',
      });
      return;
    }

    const showDate = format(dates[selectedDate], 'yyyy-MM-dd');
    const seatLabels = Array.from({ length: seats }, (_, i) => `A${i + 1}`);
    const hall = HALLS.find(h => h.id === selectedHall);

    setBookingDetails({
      movie,
      showDate,
      showTime: `${selectedTime} - ${hall?.name}`,
      seats: seatLabels,
      totalAmount,
    });

    onClose();
    navigate('/payment');
  };

  const handleClose = () => {
    setSeats(1);
    setSelectedDate(null);
    setSelectedHall(null);
    setSelectedTime(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">
            Book Tickets - {movie.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
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

          {/* Horizontal Date Selection */}
          <div className="space-y-3">
            <Label className="text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Select Date
            </Label>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-2 pb-3">
                {dates.map((date, index) => {
                  const isToday = index === 0;
                  const isTomorrow = index === 1;
                  return (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(index)}
                      className={`flex flex-col items-center min-w-[5rem] p-3 rounded-xl border-2 transition-all shrink-0 ${
                        selectedDate === index
                          ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20'
                          : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/50 hover:bg-secondary'
                      }`}
                    >
                      <span className="text-[10px] font-medium uppercase tracking-wider">
                        {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : format(date, 'EEE')}
                      </span>
                      <span className="text-2xl font-bold mt-0.5">{format(date, 'd')}</span>
                      <span className="text-xs mt-0.5">{format(date, 'MMM')}</span>
                    </button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Halls & Showtimes */}
          {selectedDate !== null && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Label className="text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Select Hall & Showtime
              </Label>
              
              <div className="space-y-4">
                {HALLS.map((hall) => (
                  <div 
                    key={hall.id}
                    className="p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{hall.name}</h4>
                        <p className="text-sm text-muted-foreground">{hall.location}</p>
                      </div>
                    </div>
                    
                    <ScrollArea className="w-full">
                      <div className="flex gap-2 pb-2">
                        {hall.showtimes.map((time) => {
                          const isSelected = selectedHall === hall.id && selectedTime === time;
                          return (
                            <button
                              key={time}
                              onClick={() => handleTimeSelect(hall.id, time)}
                              className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all shrink-0 ${
                                isSelected
                                  ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                                  : 'border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selection Summary & Proceed Button */}
          <div className="pt-4 border-t border-border space-y-4">
            {selectedDate !== null && selectedTime && selectedHall && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 animate-in fade-in duration-200">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Your Selection</h4>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <span className="text-foreground">
                    <span className="text-muted-foreground">Date:</span> {format(dates[selectedDate], 'EEE, MMM d')}
                  </span>
                  <span className="text-foreground">
                    <span className="text-muted-foreground">Time:</span> {selectedTime}
                  </span>
                  <span className="text-foreground">
                    <span className="text-muted-foreground">Hall:</span> {HALLS.find(h => h.id === selectedHall)?.name}
                  </span>
                  <span className="text-foreground">
                    <span className="text-muted-foreground">Seats:</span> {seats}
                  </span>
                </div>
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleProceedToPayment}
              disabled={selectedDate === null || !selectedTime || !selectedHall}
            >
              Proceed to Payment - ₹{totalAmount}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
