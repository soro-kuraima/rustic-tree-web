import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useAuthStore } from '../../stores/auth-store';
import { formatCurrency } from '../../lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Calendar,
  Clock,
  CreditCard,
  Check,
  X,
  Clock4,
  CheckCircle,
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';

const BookingHistory: React.FC = () => {
  const { userId } = useAuthStore();
  
  // Fetch user's bookings from Convex
  const bookings = useQuery(api.bookings.getUserBookings, { userId: userId! });
  
  // Fetch room details for each booking
  const roomsData = useQuery(api.rooms.get, {});
  
  // Map status to badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'destructive';
      case 'completed':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  
  // Map status to icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="h-4 w-4" />;
      case 'pending':
        return <Clock4 className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  // Format date from timestamp
  const formatDateFromTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), 'PPP');
  };
  
  // Get room details by ID
  const getRoomById = (roomId: string) => {
    return roomsData?.find(room => room._id === roomId);
  };
  
  if (!bookings || !roomsData) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 w-1/3 rounded"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  if (bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
          <CardDescription>You haven't made any bookings yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-gray-500">
            When you book a room, your reservations will appear here
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
          <CardDescription>Manage and view your upcoming and past stays</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => {
                const room = getRoomById(booking.roomId);
                return (
                  <TableRow key={booking._id}>
                    <TableCell className="font-medium">
                      {room ? room.name : 'Unknown Room'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                          {formatDateFromTimestamp(booking.checkIn)} - {formatDateFromTimestamp(booking.checkOut)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{booking.guests}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        <span>{formatCurrency(booking.totalPrice)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(booking.status) as any} className="flex items-center gap-1">
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BookingHistory;