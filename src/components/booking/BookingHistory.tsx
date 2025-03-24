import React, { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuthStore } from '../../stores/auth-store';
import { useBookingStore } from '../../stores/booking-store';
import { Booking } from '../../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import BookingSummary from './BookingSummary';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

const BookingHistory: React.FC = () => {
  const { userId } = useAuthStore();
  const { setBookings } = useBookingStore();
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Fetch bookings if userId is available
  const userBookings = useQuery(api.bookings.getUserBookings, { userId });
  
  useEffect(() => {
    if (userBookings) {
      setBookings(userBookings);
    }
  }, [userBookings, setBookings]);
  
  // Filter bookings based on active tab
  const filterBookings = (bookings: Booking[] | null, filter: string) => {
    if (!bookings) return [];
    
    if (filter === 'all') return bookings;
    
    return bookings.filter(booking => booking.status === filter);
  };
  
  // Sort bookings by date (most recent first)
  const sortedBookings = (bookings: Booking[]) => {
    return [...bookings].sort((a, b) => b.createdAt - a.createdAt);
  };
  
  const filteredBookings = filterBookings(userBookings, activeTab);
  
  if (!userId) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Booking History</h2>
        <p className="text-gray-600 mb-6">Please log in to view your bookings.</p>
        <Button>Log In</Button>
      </div>
    );
  }
  
  if (!userBookings) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Booking History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className=''>
      <h2 className="text-2xl font-bold mb-6">Booking History</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">No Bookings Found</h3>
              <p className="text-gray-600">
                {activeTab === 'all' 
                  ? "You haven't made any bookings yet." 
                  : `You don't have any ${activeTab} bookings.`}
              </p>
              {activeTab !== 'all' && (
                <Button variant="link" onClick={() => setActiveTab('all')}>
                  View all bookings
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBookings(filteredBookings).map((booking) => (
                <BookingSummary key={booking._id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingHistory;