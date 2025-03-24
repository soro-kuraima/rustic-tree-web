import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { useClerkUserSync } from '../hooks/useClerkUserSync';
import { useAuthStore } from '../stores/auth-store';
import PageContainer from '../components/layout/PageContainer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { ArrowLeft, Calendar, CreditCard, Download, Home, MapPin, Users } from 'lucide-react';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { Id } from '../../convex/_generated/dataModel';
import { Booking, BookingStatus } from '../types';

const BookingDetailPage: React.FC = () => {
  // Sync the user data with Convex
  useClerkUserSync();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { userId } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Convert string id to the proper Id type
  const parsedBookingId = id as Id<"bookings">;
  
  // Fetch booking data - can be further enhanced to include a check for the userId
  const booking = useQuery(api.bookings.getById, { id: parsedBookingId });
  
  // Fetch room data for the booking
  const room = booking ? useQuery(api.rooms.getById, { id: booking.roomId }) : null;
  
  // Actions
  // Note: These mutations would need to be implemented in your Convex backend
  const cancelBooking = useMutation(api.bookings.cancelBooking);
  
  const handleCancel = async () => {
    if (!booking) return;
    
    setIsLoading(true);
    try {
      await cancelBooking({ id: booking._id });
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel booking");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadInvoice = () => {
    toast.info("Invoice download initiated");
    // Implement invoice download logic
  };
  
  // Booking status styles
  const getStatusStyles = (status: BookingStatus) => {
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
  
  if (!booking || !room) {
    return (
      <PageContainer>
        <div className="py-8 px-4">
          <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Skeleton className="h-10 w-1/3 mb-6" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full rounded-lg mb-6" />
              <Skeleton className="h-8 w-1/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-8" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-36 w-full rounded-lg" />
                <Skeleton className="h-36 w-full rounded-lg" />
              </div>
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-80 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }
  
  // Calculate number of nights
  const nights = Math.ceil((booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24));
  
  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-8 px-4"
      >
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Button>
        
        <div className="flex flex-wrap justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Booking Details</h1>
          <Badge 
            variant="outline" 
            className={`${getStatusStyles(booking.status)} capitalize text-md px-3 py-1`}
          >
            {booking.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{room.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-64 rounded-md overflow-hidden mb-6">
                  <img 
                    src={room.images[0] || "/api/placeholder/800/500"} 
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <p className="text-gray-600 mb-6">{room.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-500 text-sm">Room Type</p>
                    <p className="font-medium capitalize">{room.type}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-500 text-sm">Room Size</p>
                    <p className="font-medium">{room.size} m²</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-500 text-sm">Max Capacity</p>
                    <p className="font-medium">{room.capacity} Guests</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-500 text-sm">Price per Night</p>
                    <p className="font-medium">${room.price.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                    Stay Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm">Check-in</p>
                      <p className="font-medium">{format(new Date(booking.checkIn), "EEEE, MMMM dd, yyyy")}</p>
                      <p className="text-sm text-gray-500">From 2:00 PM</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Check-out</p>
                      <p className="font-medium">{format(new Date(booking.checkOut), "EEEE, MMMM dd, yyyy")}</p>
                      <p className="text-sm text-gray-500">Until 11:00 AM</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Duration</p>
                      <p className="font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="mr-2 h-5 w-5 text-gray-500" />
                    Guest Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm">Number of Guests</p>
                      <p className="font-medium">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Booking ID</p>
                      <p className="font-medium text-sm font-mono">{booking._id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Booking Date</p>
                      <p className="font-medium">{format(new Date(booking.createdAt), "MMMM dd, yyyy")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Rate</span>
                    <span>₹{room.price.toFixed(2)} x {nights} nights</span>
                  </div>
                  
                  {room.discount && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({room.discount}%)</span>
                      <span>-₹{((room.price * room.discount / 100) * nights).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{booking.totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="font-medium">Payment Status</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {booking.status === 'pending' 
                        ? 'Payment will be processed upon confirmation' 
                        : booking.status === 'confirmed' 
                        ? 'Payment successfully processed' 
                        : booking.status === 'cancelled' 
                        ? 'No payment processed' 
                        : 'Payment completed'}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                {booking.status === 'confirmed' && (
                  <Button className="w-full" onClick={handleDownloadInvoice}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice
                  </Button>
                )}
                
                {booking.status === 'pending' && (
                  <Button 
                    className="w-full"
                    disabled={isLoading}
                  >
                    Confirm Booking
                  </Button>
                )}
                
                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled={isLoading}
                      >
                        Cancel Booking
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel this booking? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel}>
                          Cancel Booking
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                
                {booking.status === 'cancelled' && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/rooms/${room._id}`)}
                  >
                    Book Again
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
};

export default BookingDetailPage;