import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useRoomsStore } from '../../stores/rooms-store';
import { Room } from '../../types';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

const FeaturedRooms: React.FC = () => {
  const { setFeaturedRooms } = useRoomsStore();
  const featuredRooms = useQuery(api.rooms.getFeatured);

  useEffect(() => {
    if (featuredRooms) {
      setFeaturedRooms(featuredRooms);
    }
  }, [featuredRooms, setFeaturedRooms]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  if (!featuredRooms) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Accommodations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden h-96">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredRooms.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-stone-50">
      <div className="container mx-auto">
        <motion.h2 
          className="text-3xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Featured Accommodations
        </motion.h2>
        <motion.p 
          className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Discover our handpicked selection of exceptional rooms and suites for your mountain getaway
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {featuredRooms.map((room: Room) => (
            <motion.div key={room._id} variants={item}>
              <Card className="overflow-hidden h-full flex flex-col transition-transform duration-300 hover:shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={room.images[0] || "/api/placeholder/400/300"} 
                    alt={room.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  {room.discount && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                      {room.discount}% OFF
                    </span>
                  )}
                </div>
                <CardContent className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{room.name}</h3>
                    <div className="text-lg font-bold text-amber-600">
                      ${room.price}
                      <span className="text-sm text-gray-500">/night</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{room.shortDescription}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-3">{room.size} m²</span>
                    <span className="mr-3">•</span>
                    <span>{room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Link to={`/rooms/${room._id}`} className="w-full">
                    <Button className="w-full" variant="default">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link to="/rooms">
            <Button variant="outline" size="lg">View All Rooms</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedRooms;