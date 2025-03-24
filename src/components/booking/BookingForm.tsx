import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuthStore } from '../../stores/auth-store';
import { useBookingStore } from '../../stores/booking-store';
import { useRoomsStore } from '../../stores/rooms-store';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { DateRange, Room } from '../../types';
import { addDays, format, differenceInDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface BookingFormProps {
  room: Room;
}

const BookingForm: React.FC<BookingFormProps> = ({ room }) => {
  const navigate = useNavigate();
  const { userId } = useAuthStore();
  const { setDateRange, setGuests, setRoomId, setTotalPrice, currentBooking } = useBookingStore();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  const [guests, setGuestsLocal] = useState<string>('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAvailabilityChecking, setIsAvailabilityChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createBooking = useMutation(api.bookings.create);

  // Calculate number of nights
  const nights = date?.from && date?.to
    ? differenceInDays(date.to, date.from)
    : 0;

  // Calculate total price
  const totalPrice = room.discount
    ? (room.price - (room.price * (room.discount / 100))) * nights
    : room.price * nights;

  useEffect(() => {
    // Update booking store when component mounts
    if (date) {
      setDateRange(date);
    }
    setRoomId(room._id);
    setGuests(Number(guests));
    setTotalPrice(totalPrice);
  }, [date, guests, room._id, totalPrice, setDateRange, setGuests, setRoomId, setTotalPrice]);

    // Move the availability check to a React query hook
  const [availabilityParams, setAvailabilityParams] = useState<{
    roomId: Id<"rooms">;
    checkIn: number;
    checkOut: number;
  } | null>(null);
  
  const availabilityResult = useQuery(
    api.bookings.checkAvailability,
    availabilityParams ?? { roomId: room._id, checkIn: 0, checkOut: 0 },
    { enabled: availabilityParams !== null }
  );
  
  // Watch for changes in availability result
  useEffect(() => {
    if (availabilityParams && availabilityResult !== undefined) {
      setIsAvailable(availabilityResult);
      
      if (!availabilityResult) {
        setError('This room is not available for the selected dates. Please choose different dates.');
      } else {
        setError(null);
      }
      
      setIsAvailabilityChecking(false);
    }
  }, [availabilityParams, availabilityResult]);

  const checkAvailability = () => {
    if (!date?.from || !date?.to) return;
    
    setIsAvailabilityChecking(true);
    setError(null);
    
    // Update params to trigger the query
    setAvailabilityParams({
      roomId: room._id,
      checkIn: date.from.getTime(),
      checkOut: date.to.getTime(),
    });
  };

  useEffect(() => {
    if (date?.from && date?.to) {
      // We can do this check if both dates are selected
      checkAvailability();
    }
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !date?.from || !date?.to) {
      setError('Please log in and select valid dates');
      return;
    }
    
    if (Number(guests) > room.capacity) {
      setError(`This room can only accommodate ${room.capacity} guests`);
      return;
    }
    
    // Check availability again before booking
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Use the previously fetched availability result instead of calling useQuery here
      if (!isAvailable) {
        setError('This room is not available for the selected dates. Please choose different dates.');
        setIsSubmitting(false);
        return;
      }
      
      // Create booking
      await createBooking({
        userId,
        roomId: room._id,
        checkIn: date.from.getTime(),
        checkOut: date.to.getTime(),
        guests: Number(guests),
        totalPrice,
      });
      
      // Navigate to booking confirmation page
      navigate('/bookings');
    } catch (err: any) {
      setError(err.message || 'Error creating booking. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Book Your Stay</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date-range">Check-in / Check-out</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-range"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "MMM dd, yyyy")} - {format(date.to, "MMM dd, yyyy")}
                      </>
                    ) : (
                      format(date.from, "MMM dd, yyyy")
                    )
                  ) : (
                    <span>Select date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={date}
                  onSelect={setDate as any}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="guests">Number of Guests</Label>
            <Select value={guests} onValueChange={setGuestsLocal}>
              <SelectTrigger id="guests">
                <SelectValue placeholder="Select number of guests" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: room.capacity }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {isAvailabilityChecking && (
            <div className="text-center py-2">
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              <p className="text-sm text-gray-500 mt-1">Checking availability...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="rounded-md bg-gray-50 p-4">
            <h3 className="font-semibold mb-2">Booking Summary</h3>
            <div className="flex justify-between mb-1">
              <span>Room Type:</span>
              <span className="capitalize">{room.type}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Price per night:</span>
              <span>${room.discount 
                ? (room.price - (room.price * (room.discount / 100))).toFixed(2) 
                : room.price.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Number of nights:</span>
              <span>{nights}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={!isAvailable || isSubmitting || nights === 0 || isAvailabilityChecking}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Complete Booking'
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default BookingForm;