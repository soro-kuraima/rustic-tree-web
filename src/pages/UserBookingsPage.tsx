import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../stores/auth-store';
import { useBookingStore } from '../stores/booking-store';
import PageContainer from '../components/layout/PageContainer';
import BookingHistory from '../components/booking/BookingHistory';

const UserBookingsPage: React.FC = () => {
  // Use auth store for userId instead of querying again
  const { userId,  } = useAuthStore();
  const { setBookings } = useBookingStore();
  
  // Only fetch bookings if we have a userId
  const userBookings = useQuery(api.bookings.getUserBookings, userId ? { userId} : "skip");
  
  // Update bookings store when data changes
  useEffect(() => {
    if (userBookings) {
      setBookings(userBookings);
    }
  }, [userBookings, setBookings]);
  
  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-8"
      >
        <BookingHistory />
      </motion.div>
    </PageContainer>
  );
};

export default UserBookingsPage;