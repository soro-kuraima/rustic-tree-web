import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { motion } from 'motion/react';
import { api } from '../../convex/_generated/api';
import { useRoomsStore } from '../stores/rooms-store';
import { useClerkUserSync } from '../hooks/useClerkUserSync';
import PageContainer from '../components/layout/PageContainer';
import RoomDetails from '../components/rooms/RoomDetails';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Id } from '../../convex/_generated/dataModel';

const RoomDetailPage: React.FC = () => {
  // Sync the user data with Convex
  useClerkUserSync();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { setSelectedRoom } = useRoomsStore();
  
  // Convert string id to the proper Id type
  const parsedRoomId = id as Id<"rooms">;
  
  // Fetch room data
  const room = useQuery(api.rooms.getById, { id: parsedRoomId });
  
  useEffect(() => {
    if (room) {
      setSelectedRoom(room);
    }
  }, [room, setSelectedRoom]);
  
  const handleBookNow = () => {
    if (room) {
      navigate(`/booking/${room._id}`);
    } else {
      toast.error("Room information not available");
    }
  };
  
  if (!room) {
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
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/rooms')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rooms
        </Button>
        
        <RoomDetails room={room} onBookNow={handleBookNow} />
      </motion.div>
    </PageContainer>
  );
};

export default RoomDetailPage;