import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { motion } from 'motion/react';
import { api } from '../../convex/_generated/api';
import { useClerkUserSync } from '../hooks/useClerkUserSync';
import PageContainer from '../components/layout/PageContainer';
import BookingForm from '../components/booking/BookingForm';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Id } from '../../convex/_generated/dataModel';

const BookingPage: React.FC = () => {
  // Sync the user data with Convex
  useClerkUserSync();
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  
  // Convert string roomId to the proper Id type
  const parsedRoomId = roomId as Id<"rooms">;
  
  // Fetch room data
  const room = useQuery(api.rooms.getById, { id: parsedRoomId });

  const images = room?.images;
    
      const roomImageUrls = useQuery(api.files.getBatchFileUrls, {storageIds: images as Id<"_storage">[] });
  
  
  useEffect(() => {
    if (roomId && !room) {
      // Room is being loaded
    } else if (!roomId) {
      toast.error("No room selected");
      navigate('/rooms');
    }
  }, [roomId, room, navigate]);
  
  if (!room && !roomImageUrls && roomImageUrls !== undefined) {
    return (
      <PageContainer>
        <div className="py-8 px-4">
          <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-80 w-full rounded-lg mb-4" />
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))}
              </div>
              <Skeleton className="h-10 w-1/3 mt-6 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }
  
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
          Back to Room
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
              <p className="text-gray-600">{room.shortDescription}</p>
            </div>
            
            <div className="mb-6">
              <img 
                src={roomImageUrls[0].url || "/api/placeholder/800/500"} 
                alt={room.name}
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            
            <div className="bg-transparent p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Room Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Type</p>
                  <p className="font-medium text-amber-600 capitalize">{room.type}</p>
                </div>
                <div>
                  <p className="text-gray-600">Size</p>
                  <p className="font-medium text-amber-600">{room.size} m²</p>
                </div>
                <div>
                  <p className="text-gray-600">Capacity</p>
                  <p className="font-medium text-amber-600">{room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Price per night</p>
                  <p className="font-medium text-amber-600">₹{room.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <BookingForm room={room} />
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
};

export default BookingPage;