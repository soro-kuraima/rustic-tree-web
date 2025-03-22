import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BedDouble, Users, ArrowRight, Square } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardFooter, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { formatCurrency } from '../../lib/utils';
import { Id } from '../../../convex/_generated/dataModel';

interface RoomCardProps {
  id: Id<"rooms">;
  name: string;
  type: 'standard' | 'deluxe' | 'suite';
  shortDescription: string;
  price: number;
  capacity: number;
  size: number;
  images: string[];
  index: number;
}

const RoomCard: React.FC<RoomCardProps> = ({
  id,
  name,
  type,
  shortDescription,
  price,
  capacity,
  size,
  images,
  index,
}) => {
  // Get the first image for the card
  const imageUrl = images.length > 0 ? images[0] : '/images/room-placeholder.jpg';
  
  // Map room types to badge colors
  const badgeVariant = {
    standard: 'secondary',
    deluxe: 'default',
    suite: 'destructive',
  }[type] as 'secondary' | 'default' | 'destructive';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <Badge 
            variant={badgeVariant}
            className="absolute top-3 right-3"
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        </div>
        
        <CardContent className="flex-grow pt-4">
          <CardTitle className="text-xl mb-2">{name}</CardTitle>
          <p className="text-gray-600 mb-4">{shortDescription}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <BedDouble className="h-4 w-4 mr-1" />
              <span>{type === 'standard' ? 'Twin Beds' : 'King Bed'}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{capacity} {capacity === 1 ? 'Guest' : 'Guests'}</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{size} sq ft</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">{formatCurrency(price)}</span>
            <span className="text-gray-500 text-sm"> / night</span>
          </div>
          <Link to={`/rooms/${id}`}>
            <Button>
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RoomCard;