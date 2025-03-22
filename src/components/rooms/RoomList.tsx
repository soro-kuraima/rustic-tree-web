import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import RoomCard from './RoomCard';
import RoomFilters from './RoomFilters';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';

const RoomList: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  // Get filter values from URL params
  const type = searchParams.get('type') as 'standard' | 'deluxe' | 'suite' | undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const capacity = searchParams.get('capacity') ? Number(searchParams.get('capacity')) : undefined;
  
  // Fetch rooms with filters directly from Convex
  const rooms = useQuery(api.rooms.get, {
    type,
    minPrice,
    maxPrice,
    capacity,
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-2">Our Rooms</h2>
        <p className="text-gray-600 mb-8">Choose from our selection of comfortable and luxurious rooms</p>
        
        <RoomFilters />
        
        {rooms === undefined ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
            <p className="text-gray-600">Try adjusting your filters to find available rooms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, index) => (
              <RoomCard
                key={room._id}
                id={room._id}
                name={room.name}
                type={room.type}
                shortDescription={room.shortDescription}
                price={room.price}
                capacity={room.capacity}
                size={room.size}
                images={room.images}
                index={index}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RoomList;