import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import { api } from '../../../convex/_generated/api';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import RoomCard from '../rooms/RoomCard';

const FeaturedRooms: React.FC = () => {
  // Fetch featured rooms from Convex
  const featuredRooms = useQuery(api.rooms.getFeatured);
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Featured Accommodations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our selection of premium rooms and suites, each designed to provide an exceptional stay with stunning views and modern comforts.
          </p>
        </motion.div>
        
        {featuredRooms === undefined ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRooms.slice(0, 3).map((room, index) => (
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
            
            <div className="text-center mt-12">
              <Link to="/rooms">
                <Button size="lg" className="gap-2">
                  View All Rooms
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedRooms;