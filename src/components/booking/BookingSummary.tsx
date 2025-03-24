import React from 'react';
import { format } from 'date-fns';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Booking } from '../../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CalendarDays, Users, CreditCard, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookingSummaryProps {
  booking: Booking;
  hideActions?: boolean;
  isCompact?: boolean;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ 
  booking, 
  hideActions = false,
  isCompact = false,
}) => {
  const room = useQuery(api.rooms.getById, { id: booking.roomId });

  console.log(booking.userId);

  const navigate = useNavigate();

  const cancelBooking = useMutation(api.bookings.cancelBooking);
  const confirmBooking = useMutation(api.bookings.confirmBooking);
  const completeBooking = useMutation(api.bookings.completeBooking);

  const handleBookingStatusUpdate = async (e: React.FormEvent, action: string) => {
    e.preventDefault();

    if (action === "cancel") {
      await cancelBooking({id: booking._id});
    }

    if (action === "confirm") {
      await confirmBooking({id: booking._id})
    }
    
  }

  if (!room) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className={isCompact ? 'pb-2' : ''}>
        <div className="flex justify-between items-start">
          <CardTitle className={isCompact ? 'text-lg' : 'text-xl'}>
            {room.name}
          </CardTitle>
          <Badge
            variant="outline"
            className={`${getStatusColor(booking.status)} capitalize`}
          >
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className={`flex-grow ${isCompact ? 'py-2' : ''}`}>
        <div className={`grid ${isCompact ? 'gap-2' : 'gap-4'}`}>
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
            <div>
              <p className={`${isCompact ? 'text-sm' : ''}`}>
                {format(new Date(booking.checkIn), 'MMM dd, yyyy')} - {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
              </p>
              <p className="text-xs text-gray-500">
                {Math.ceil((booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24))} nights
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            <span className={`${isCompact ? 'text-sm' : ''}`}>
              {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
            </span>
          </div>
          
          {!isCompact && (
            <>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">₹{booking.totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm">Booked on</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </>
          )}
          
          {isCompact && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Total:</span>
              <span className="font-medium">₹{booking.totalPrice.toFixed(2)}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      {!hideActions && !isCompact && (
        <CardFooter className="border-t pt-4">
          {booking.status === 'pending' && (
            <div className="w-full grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={(e) => handleBookingStatusUpdate(e, 'cancel')}>
                Cancel
              </Button>
              <Button size="sm" onClick={(e) => handleBookingStatusUpdate(e, 'confirm')}>
                Confirm
              </Button>
            </div>
          )}
          
          {booking.status === 'confirmed' && (
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          )}
          
          {booking.status === 'cancelled' && (
            <Button variant="outline" size="sm" className="w-full"
            onClick={() => navigate(`/rooms/${booking.roomId}`)}>
              Book Again
            </Button>
          )}
          
          {booking.status === 'completed' && (
            <Button variant="outline" size="sm" className="w-full">
              Leave Review
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default BookingSummary;