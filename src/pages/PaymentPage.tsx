import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useBookingContext } from '@/contexts/BookingContext';
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Smartphone, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Loader2,
  CheckCircle,
  Film
} from 'lucide-react';

type PaymentMethod = 'debit' | 'credit' | 'upi';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { bookingDetails, clearBooking } = useBookingContext();
  const { createBooking, processPayment, loading } = useBookings();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment');
  const [bookingId, setBookingId] = useState<string | null>(null);
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // UPI form state
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    if (!bookingDetails) {
      navigate('/');
    }
    if (!user) {
      toast({
        title: 'Sign In Required',
        description: 'Please sign in to complete your booking.',
        variant: 'destructive',
      });
      navigate('/auth');
    }
  }, [bookingDetails, user, navigate, toast]);

  if (!bookingDetails) {
    return null;
  }

  const { movie, showDate, showTime, seats, totalAmount } = bookingDetails;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateCardForm = () => {
    if (cardNumber.replace(/\s/g, '').length < 16) {
      toast({ title: 'Invalid Card Number', description: 'Please enter a valid 16-digit card number.', variant: 'destructive' });
      return false;
    }
    if (!cardName.trim()) {
      toast({ title: 'Name Required', description: 'Please enter the name on card.', variant: 'destructive' });
      return false;
    }
    if (expiryDate.length < 5) {
      toast({ title: 'Invalid Expiry', description: 'Please enter a valid expiry date (MM/YY).', variant: 'destructive' });
      return false;
    }
    if (cvv.length < 3) {
      toast({ title: 'Invalid CVV', description: 'Please enter a valid CVV.', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const validateUpiForm = () => {
    if (!upiId.includes('@')) {
      toast({ title: 'Invalid UPI ID', description: 'Please enter a valid UPI ID (e.g., name@upi).', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    // Validate based on payment method
    if (paymentMethod === 'upi') {
      if (!validateUpiForm()) return;
    } else {
      if (!validateCardForm()) return;
    }

    setStep('processing');

    // Create booking first
    const { success, bookingId: newBookingId } = await createBooking({
      movieId: movie.id,
      movieTitle: movie.title,
      showDate,
      showTime,
      seats,
      totalAmount,
    });

    if (!success || !newBookingId) {
      setStep('payment');
      return;
    }

    setBookingId(newBookingId);

    // Process mock payment
    const paymentResult = await processPayment(newBookingId, movie.title);

    if (paymentResult.success) {
      setStep('success');
    } else {
      setStep('payment');
    }
  };

  const handleGoHome = () => {
    clearBooking();
    navigate('/');
  };

  const handleBack = () => {
    clearBooking();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {step === 'payment' && (
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <h1 className="text-xl font-bold text-foreground">
              {step === 'success' ? 'Booking Confirmed' : 'Complete Payment'}
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {step === 'payment' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Film className="w-5 h-5 text-primary" />
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Movie Poster & Title */}
                  <div className="flex gap-4">
                    <img 
                      src={movie.poster_url || '/placeholder.svg'} 
                      alt={movie.title}
                      className="w-20 h-28 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{movie.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {movie.genres.slice(0, 2).join(', ')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {movie.languages[0]} • {movie.duration_minutes} min
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{format(new Date(showDate), 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{showTime}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{seats.length} Seat(s): {seats.join(', ')}</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Ticket Price ({seats.length}x)</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Convenience Fee</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg text-foreground pt-2 border-t border-border">
                      <span>Total Amount</span>
                      <span className="text-primary">₹{totalAmount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="credit" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Credit Card
                      </TabsTrigger>
                      <TabsTrigger value="debit" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Debit Card
                      </TabsTrigger>
                      <TabsTrigger value="upi" className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        UPI
                      </TabsTrigger>
                    </TabsList>

                    {/* Credit/Debit Card Form */}
                    <TabsContent value="credit" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            type="password"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="debit" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="debitCardNumber">Card Number</Label>
                        <Input
                          id="debitCardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="debitCardName">Name on Card</Label>
                        <Input
                          id="debitCardName"
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="debitExpiry">Expiry Date</Label>
                          <Input
                            id="debitExpiry"
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="debitCvv">CVV</Label>
                          <Input
                            id="debitCvv"
                            placeholder="123"
                            type="password"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="upi" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input
                          id="upiId"
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => setUpiId('example@paytm')}>
                          @paytm
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setUpiId('example@gpay')}>
                          @gpay
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setUpiId('example@phonepe')}>
                          @phonepe
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setUpiId('example@ybl')}>
                          @ybl
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Button 
                    className="w-full mt-6" 
                    size="lg"
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay ₹{totalAmount}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    By clicking Pay, you agree to our Terms of Service and Privacy Policy.
                    Your payment information is securely processed.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Processing Payment</h2>
              <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="max-w-lg mx-auto">
            <Card>
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Booking Confirmed!</h2>
                  <p className="text-muted-foreground">
                    Your tickets have been booked successfully. A confirmation email has been sent.
                  </p>
                </div>

                {/* Receipt */}
                <div className="mt-8 p-6 bg-secondary/50 rounded-lg space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-sm text-muted-foreground">Booking ID</span>
                    <span className="font-mono text-sm text-foreground">{bookingId?.slice(0, 8).toUpperCase()}</span>
                  </div>
                  
                  <div className="flex gap-4">
                    <img 
                      src={movie.poster_url || '/placeholder.svg'} 
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{movie.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(showDate), 'EEE, MMM d')} • {showTime}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Seats: {seats.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">Amount Paid</span>
                      <span className="font-bold text-primary">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-6" size="lg" onClick={handleGoHome}>
                  Back to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default PaymentPage;
