import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Room } from '../../types';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface RoomCardProps {
  room: Room;
  index: number;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, index }) => {
  // Calculate the discounted price if there's a discount
  const finalPrice = room.discount 
    ? room.price - (room.price * (room.discount / 100)) 
    : room.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-52 overflow-hidden">
          <img 
            src={room.images[0] || "/api/placeholder/400/300"} 
            alt={room.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          {room.featured && (
            <Badge 
              className="absolute top-4 left-4 bg-amber-500 hover:bg-amber-600"
            >
              Featured
            </Badge>
          )}
          {room.discount && (
            <Badge 
              variant="destructive"
              className="absolute top-4 right-4"
            >
              {room.discount}% OFF
            </Badge>
          )}
          <Badge 
            variant="outline"
            className="absolute bottom-4 left-4 bg-black/70 text-white border-0"
          >
            {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
          </Badge>
        </div>
        
        <CardContent className="p-6 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold">{room.name}</h3>
            <div className="text-right">
              {room.discount ? (
                <>
                  <span className="text-lg font-bold text-amber-600">
                    ${finalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 ml-2 line-through">
                    ${room.price.toFixed(2)}
                  </span>
                  <div className="text-sm text-gray-500">/night</div>
                </>
              ) : (
                <>
                  <span className="text-lg font-bold text-amber-600">
                    ${room.price.toFixed(2)}
                  </span>
                  <div className="text-sm text-gray-500">/night</div>
                </>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">{room.shortDescription}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {room.amenities.slice(0, 3).map((amenity, i) => (
              <Badge key={i} variant="secondary" className="bg-gray-100">
                {amenity}
              </Badge>
            ))}
            {room.amenities.length > 3 && (
              <Badge variant="secondary" className="bg-gray-100">
                +{room.amenities.length - 3} more
              </Badge>
            )}
          </div>
          
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
  );
};

export default RoomCard;