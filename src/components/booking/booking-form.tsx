import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, CreditCard, Users, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '../../components/ui/calendar';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { useAuthStore } from '../../stores/auth-store';
import { useBookingStore } from '../../stores/booking-store';
import { formatCurrency, formatDate } from '../../lib/utils';
import { DateRange } from '../../types';

const BookingForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userId } = useAuthStore();
  const { currentBooking, setBookingDetails, clearBookingDetails } = useBookingStore();
  
  // Payment information state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Format dates for display
  let checkInFormatted = 'Select date';
  let checkOutFormatted = 'Select date';
  
  if (currentBooking.checkIn && currentBooking.checkOut) {
    checkInFormatted = format(currentBooking.checkIn, 'PPP');
    checkOutFormatted = format(currentBooking.checkOut, 'PPP');
  }
  
  // Local state for booking parameters that may have been initialized in the store
  const [dateRange, setDateRange] = useState<DateRange>({
    from: currentBooking.checkIn || undefined,
    to: currentBooking.checkOut || undefined,
  });
  const [guests, setGuests] = useState(currentBooking.guests || 1);
  
  // Fetch room details from Convex
  const room = useQuery(api.rooms.getById, { id: id! });
  
  // Create booking mutation
  const createBooking = useMutation(api.bookings.create);
  
  // Check availability query
  const isAvailable = useQuery(api.bookings.checkAvailability, {
    roomId: id!,
    checkIn: dateRange.from?.getTime() || 0,
    checkOut: dateRange.to?.getTime() || 0,
  });
  
  // Calculate number of nights and total price
  const nights = dateRange.from && dateRange.to
    ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const totalPrice = room ? nights * room.price : 0;
  
  // Update booking details in store when form values change
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      setBookingDetails({
        roomId: id,
        checkIn: dateRange.from,
        checkOut: dateRange.to,
        guests,
        totalPrice,
      });
    }
  }, [dateRange, guests, totalPrice, id, setBookingDetails]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !room || !dateRange.from || !dateRange.to) {
      setError('Missing required booking information');
      return;
    }
    
    if (!isAvailable) {
      setError('Room is not available for selected dates');
      return;
    }
    
    // Basic card validation
    if (cardName.trim().length < 3) {
      setError('Please enter a valid cardholder name');
      return;
    }
    
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number');
      return;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setError('Please enter a valid expiry date (MM/YY)');
      return;
    }
    
    if (!/^\d{3,4}$/.test(cvc)) {
      setError('Please enter a valid CVC code');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create the booking in Convex
      await createBooking({
        userId,
        roomId: id!,
        checkIn: dateRange.from.getTime(),
        checkOut: dateRange.to.getTime(),
        guests,
        totalPrice,
      });
      
      // Clear the booking state
      clearBookingDetails();
      
      // Redirect to booking confirmation
      navigate('/bookings');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };
  
  if (!room) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 w-1/3 mb-8 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 w-1/2 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
      <p className="text-gray-600 mb-8">You're almost ready to enjoy your stay at {room.name}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>Review and adjust your booking details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date-range">Check In - Check Out</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-range"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {dateRange.from && dateRange.to ? (
                        <>
                          {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                        </>
                      ) : (
                        "Select dates"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Select 
                  value={String(guests)} 
                  onValueChange={(val) => setGuests(Number(val))}
                >
                  <SelectTrigger id="guests">
                    <SelectValue placeholder="Select guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: room.capacity }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {isAvailable === false && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Not Available</AlertTitle>
                  <AlertDescription>
                    The room is not available for the selected dates. Please choose different dates.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>All transactions are secure and encrypted</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-name">Cardholder Name</Label>
                <Input
                  id="card-name"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <div className="relative">
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/[^\d\s]/g, ''))}
                    maxLength={19}
                  />
                  <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    maxLength={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-medium">{room.name}</h3>
                  <p className="text-sm text-gray-500">{room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-b py-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check In</span>
                  <span className="font-medium">{checkInFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check Out</span>
                  <span className="font-medium">{checkOutFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nights</span>
                  <span className="font-medium">{nights}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{formatCurrency(room.price)} x {nights} nights</span>
                  <span>{formatCurrency(room.price * nights)}</span>
                </div>
                {room.discount && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({room.discount}%)</span>
                    <span>-{formatCurrency((room.price * nights * room.discount) / 100)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Taxes & Fees</span>
                  <span>{formatCurrency(totalPrice * 0.1)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>
                    {formatCurrency(
                      room.discount
                        ? totalPrice - (totalPrice * room.discount) / 100 + totalPrice * 0.1
                        : totalPrice + totalPrice * 0.1
                    )}
                  </span>
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmit}
                className="w-full"
                size="lg"
                disabled={
                  loading ||
                  !dateRange.from ||
                  !dateRange.to ||
                  isAvailable === false ||
                  cardName.trim() === '' ||
                  cardNumber.trim() === '' ||
                  expiryDate.trim() === '' ||
                  cvc.trim() === ''
                }
              >
                {loading ? "Processing..." : `Complete Booking - ${formatCurrency(totalPrice + totalPrice * 0.1)}`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingForm;
