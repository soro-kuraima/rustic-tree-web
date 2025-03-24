import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Room } from '../../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '../ui/carousel';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Card, CardContent } from '../ui/card';
import { 
  Bed, 
  Users, 
  SquareDotIcon, 
  WifiIcon, 
  UtensilsIcon, 
  TvIcon, 
  ThermometerIcon, 
  CarIcon 
} from 'lucide-react';

interface RoomDetailsProps {
  room: Room;
  onBookNow: () => void;
}

const RoomDetails: React.FC<RoomDetailsProps> = ({ room, onBookNow }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const amenityIcons: Record<string, React.ReactNode> = {
    "Free WiFi": <WifiIcon className="h-5 w-5" />,
    "Room Service": <UtensilsIcon className="h-5 w-5" />,
    "Flat-screen TV": <TvIcon className="h-5 w-5" />,
    "Air Conditioning": <ThermometerIcon className="h-5 w-5" />,
    "Free Parking": <CarIcon className="h-5 w-5" />,
  };

  // Calculate the discounted price if there's a discount
  const finalPrice = room.discount 
    ? room.price - (room.price * (room.discount / 100)) 
    : room.price;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Room Images and Gallery - Takes up 2/3 of the screen on desktop */}
        <div className="lg:col-span-2">
          <Carousel className="mb-4">
            <CarouselContent>
              {room.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <img 
                      src={image || "/api/placeholder/800/500"} 
                      alt={`${room.name} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>

          <div className="grid grid-cols-5 gap-2 mb-8">
            {room.images.slice(0, 5).map((image, index) => (
              <div 
                key={index}
                className={`aspect-video cursor-pointer rounded-md overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-amber-500' : ''
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img 
                  src={image || "/api/placeholder/200/150"} 
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <Tabs defaultValue="description" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <h3 className="text-2xl font-bold mb-4">{room.name}</h3>
              <p className="text-gray-700 mb-6">{room.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 text-amber-600 mr-3" />
                  <div>
                    <p className="font-medium">Room Type</p>
                    <p className="text-gray-600 capitalize">{room.type}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-amber-600 mr-3" />
                  <div>
                    <p className="font-medium">Max Occupancy</p>
                    <p className="text-gray-600">{room.capacity} Guests</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <SquareDotIcon className="h-5 w-5 text-amber-600 mr-3" />
                  <div>
                    <p className="font-medium">Room Size</p>
                    <p className="text-gray-600">{room.size} m²</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="amenities" className="mt-6">
              <h3 className="text-xl font-bold mb-4">Room Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-3">
                      {amenityIcons[amenity] || <span>•</span>}
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="rules" className="mt-6">
              <h3 className="text-xl font-bold mb-4">House Rules</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-3 text-amber-600">•</span>
                  <span>Check-in time: 2:00 PM to 10:00 PM</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-amber-600">•</span>
                  <span>Check-out time: 11:00 AM</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-amber-600">•</span>
                  <span>No smoking inside the rooms</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-amber-600">•</span>
                  <span>Quiet hours: 10:00 PM to 7:00 AM</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-amber-600">•</span>
                  <span>Pets are not allowed</span>
                </li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking Information - Takes up 1/3 of the screen on desktop */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold">Pricing</h3>
                  {room.featured && (
                    <Badge className="bg-amber-500 hover:bg-amber-600">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-baseline mb-4">
                  {room.discount ? (
                    <>
                      <span className="text-3xl font-bold text-amber-600">
                        ${finalPrice.toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-500 ml-2 line-through">
                        ${room.price.toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-600 ml-2">
                        /night
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-amber-600">
                        ${room.price.toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-600 ml-2">
                        /night
                      </span>
                    </>
                  )}
                </div>
                
                {room.discount && (
                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                    Save {room.discount}% for a limited time
                  </Badge>
                )}
              </div>
              
              <div className="border-t border-gray-200 my-6 pt-6">
                <h4 className="font-medium mb-4">Select Dates</h4>
                <Calendar
                  mode="range"
                  className="border rounded-md p-3"
                />
              </div>
              
              <Button onClick={onBookNow} className="w-full mb-4">
                Book Now
              </Button>
              
              <p className="text-sm text-gray-500 text-center">
                No charge until booking is confirmed
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;