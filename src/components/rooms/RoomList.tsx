import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useRoomsStore } from '../../stores/rooms-store';
import RoomCard from './RoomCard';
import { Room } from '../../types';
import { Skeleton } from '../ui/skeleton';

const RoomList: React.FC = () => {
  const { filters, setRooms, rooms, isLoading, setLoading } = useRoomsStore();
  
  const roomsData = useQuery(api.rooms.get, {
    type: filters.type,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    capacity: filters.capacity,
  });

  console.log(roomsData);

  useEffect(() => {
    setLoading(true);
    if (roomsData) {
      setRooms(roomsData);
      setLoading(false);
    }
  }, [roomsData, setRooms, setLoading]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[450px]">
            <Skeleton className="h-52 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-8 w-full mt-6" />
          </div>
        ))}
      </div>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <h3 className="text-xl font-semibold mb-2">No Rooms Found</h3>
        <p className="text-gray-500">
          No rooms match your current filtering criteria. Try adjusting your filters.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {rooms.map((room: Room, index: number) => (
        <RoomCard key={room._id} room={room} index={index} />
      ))}
    </div>
  );
};

export default RoomList;