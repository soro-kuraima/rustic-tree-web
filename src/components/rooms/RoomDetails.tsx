import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Users, BedDouble, Square, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Calendar } from '../../components/ui/calendar';
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
import { useAuthStore } from '../../stores/auth-store';
import { useBookingStore } from '../../stores/booking-store';
import { formatCurrency, formatDate } from '../../lib/utils';
import { DateRange } from '../../types';

const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setBookingDetails } = useBookingStore();
  
  // Local state for booking parameters
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [guests, setGuests] = useState(1);
  
  // Fetch room details from Convex
  const room = useQuery(api.rooms.getById, { id: id! });
  
  // Calculate number of nights and total price
  const nights = dateRange.from && dateRange.to
    ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const totalPrice = room ? nights * room.price : 0;
  
  const handleBookNow = () => {
    if (!isAuthenticated) {
      // Redirect to login with redirect back to this page
      navigate(`/login?redirect=/rooms/${id}`);
      return;
    }
    
    if (!room || !dateRange.from || !dateRange.to) return;
    
    // Set booking details in store
    setBookingDetails({
      roomId: id,
      checkIn: dateRange.from,
      checkOut: dateRange.to,
      guests,
      totalPrice,
    });
    
    // Navigate to booking page
    navigate(`/booking/${id}`);
  };
  
  if (!room) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 w-2/3 mb-4 rounded"></div>
          <div className="h-6 bg-gray-200 w-1/3 mb-8 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 w-1/2 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 w-1/4 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
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
      <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
      <p className="text-gray-600 mb-8">{room.shortDescription}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {room.images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={index === 0 ? "md:col-span-2 h-80" : "h-56"}
              >
                <img 
                  src={image} 
                  alt={`${room.name} - ${index}`}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </motion.div>
            ))}
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Room Details</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{room.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-2 text-gray-700">
                <BedDouble className="h-5 w-5 text-primary" />
                <span>{room.type === 'standard' ? 'Twin Beds' : 'King Bed'}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Users className="h-5 w-5 text-primary" />
                <span>Max {room.capacity} Guests</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Square className="h-5 w-5 text-primary" />
                <span>{room.size} sq ft</span>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-3">Amenities</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {room.amenities.map((amenity, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 border">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-2xl font-bold">{formatCurrency(room.price)}</span>
                <span className="text-gray-500"> / night</span>
              </div>
              {room.discount && (
                <span className="bg-red-100 text-red-800 text-sm font-medium rounded-full px-3 py-1">
                  {room.discount}% OFF
                </span>
              )}
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Check In - Check Out</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                          </>
                        ) : (
                          formatDate(dateRange.from)
                        )
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
                <label className="text-sm font-medium">Guests</label>
                <Select value={String(guests)} onValueChange={(val) => setGuests(Number(val))}>
                  <SelectTrigger>
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
            </div>
            
            {nights > 0 && (
              <div className="space-y-2 mb-6 border-t border-b py-4">
                <div className="flex justify-between text-sm">
                  <span>{formatCurrency(room.price)} x {nights} nights</span>
                  <span>{formatCurrency(room.price * nights)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleBookNow}
              className="w-full" 
              size="lg"
              disabled={!dateRange.from || !dateRange.to}
            >
              Book Now
            </Button>
            
            <p className="text-sm text-gray-500 mt-4 text-center">
              You won't be charged yet
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomDetails;