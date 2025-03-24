import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Room, DateRange } from '../../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi
} from '../ui/carousel';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Card, CardContent } from '../ui/card';
import { 
  Bed, 
  Users, 
  SquareCheckIcon, 
  WifiIcon, 
  UtensilsIcon, 
  TvIcon, 
  ThermometerIcon, 
  CarIcon,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { addDays, format, differenceInDays } from 'date-fns';
import { useBookingStore } from '../../stores/booking-store';
import { Id } from '../../../convex/_generated/dataModel';
import { useAuth, useClerk } from '@clerk/clerk-react';

interface RoomDetailsProps {
  room: Room;
  onBookNow: () => void;
}

const RoomDetails: React.FC<RoomDetailsProps> = ({ room, onBookNow }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Store the date range in booking store
  const { setDateRange, setRoomId, setTotalPrice, currentBooking } = useBookingStore();
  const [date, setDate] = useState<DateRange>(() => currentBooking?.dateRange ? currentBooking?.dateRange : {
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  const images = room?.images;
  
  const roomImageUrls = useQuery(api.files.getBatchFileUrls, {storageIds: images as Id<"_storage">[]});

  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  // Control carousel when selectedImage changes
  useEffect(() => {
    if (carouselApi) {
      carouselApi.scrollTo(selectedImage);
    }
  }, [selectedImage, carouselApi]);

  // Calculate number of nights
  const nights = date?.from && date?.to
    ? differenceInDays(date.to, date.from)
    : 1;

  // Calculate total price based on selected nights
  const pricePerNight = room.discount 
    ? room.price - (room.price * (room.discount / 100)) 
    : room.price;
    
  const totalPrice = pricePerNight * Math.max(nights, 1);

  // Update booking store when dates change
  useEffect(() => {
    if (date) {
      setDateRange(date);
      setRoomId(room._id);
      setTotalPrice(totalPrice);
    }
  }, [date, room._id, totalPrice, setDateRange, setRoomId, setTotalPrice]);

  const amenityIcons: Record<string, React.ReactNode> = {
    "Free WiFi": <WifiIcon className="h-5 w-5" />,
    "Room Service": <UtensilsIcon className="h-5 w-5" />,
    "Flat-screen TV": <TvIcon className="h-5 w-5" />,
    "Air Conditioning": <ThermometerIcon className="h-5 w-5" />,
    "Free Parking": <CarIcon className="h-5 w-5" />,
  };

  // Update selected image when carousel changes
  const handleCarouselChange = (api: CarouselApi) => {
    if (!api) return;
    
    api.on("select", () => {
      setSelectedImage(api.selectedScrollSnap());
    });
  };

  // Custom date change handler
  const handleDateChange = (value: DateRange) => {
    setDate(value);
    // Close calendar after selecting both dates
    if (value?.from && value?.to) {
      setTimeout(() => setIsCalendarOpen(false), 300);
    }
  };

  const handleBookNow = () => {
  if (!isSignedIn) {
    openSignIn();
  } else {
    // Make sure dates are set before booking
    if (date?.from && date?.to) {
      onBookNow();
    }
    }
  };

  return (
    <div className="max-w-6xl mx-auto mx-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Room Images and Gallery - Takes up 2/3 of the screen on desktop */}
        <div className="lg:col-span-2">
          <Carousel 
            className="mb-4" 
            opts={{ loop: true, startIndex: selectedImage }}
            setApi={(api) => {
              setCarouselApi(api);
              handleCarouselChange(api);
            }}
          >
            <CarouselContent>
              {roomImageUrls !== undefined && roomImageUrls?.map((image, index) => (
                <CarouselItem key={index}>
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative aspect-video overflow-hidden rounded-lg"
                    >
                      <img 
                        src={image.url || "/api/placeholder/800/500"} 
                        alt={`${room.name} - View ${index + 1}`}
                        className="h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>

          <div className="grid grid-cols-5 gap-2 mb-8">
            {roomImageUrls !== undefined && roomImageUrls?.slice(0, 5).map((image, index) => (
              <div 
                key={index}
                className={`aspect-video cursor-pointer rounded-md overflow-hidden transition-all duration-200 ${
                  selectedImage === index 
                    ? 'ring-2 ring-amber-500 scale-105 shadow-md' 
                    : 'hover:opacity-90 hover:ring-1 hover:ring-amber-300'
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img 
                  src={image.url || "/api/placeholder/200/150"} 
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
                  <SquareCheckIcon className="h-5 w-5 text-amber-600 mr-3" />
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
                        ₹{pricePerNight.toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-500 ml-2 line-through">
                        ₹{room.price.toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-600 ml-2">
                        /night
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-amber-600">
                        ₹{room.price.toFixed(2)}
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
                
                {/* Calendar popup with button */}
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 border rounded-md">
                        <p className="text-xs text-gray-500">Check-in</p>
                        <p className="font-medium">
                          {date.from ? format(date.from, "MMM dd, yyyy") : 'Select date'}
                        </p>
                      </div>
                      <div className="p-3 border rounded-md">
                        <p className="text-xs text-gray-500">Check-out</p>
                        <p className="font-medium">
                          {date.to ? format(date.to, "MMM dd, yyyy") : 'Select date'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Regular button to open calendar dialog */}
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)} 
                    className="w-full flex items-center justify-center"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {isCalendarOpen ? "Close Calendar" : "Change Dates"}
                  </Button>
                  
                  {/* Calendar dialog */}
                  {isCalendarOpen && (
                    <div className="absolute z-50 bg-white border rounded-md shadow-lg mt-2 p-2">
                      <Calendar
                        mode="range"
                        selected={date}
                        onSelect={handleDateChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        numberOfMonths={1}
                      />
                    </div>
                  )}
                  
                  {date?.from && date?.to && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-md">
                      <p className="flex justify-between mb-1">
                        <span className="text-gray-600">₹{pricePerNight.toFixed(2)} x {nights} nights</span>
                        <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                      </p>
                      <p className="flex justify-between font-medium text-lg pt-2 border-t mt-2">
                        <span>Total</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={handleBookNow} 
                className="w-full mb-4"
                disabled={!date?.from || !date?.to || nights < 1}
              >
                {!date?.from || !date?.to || nights < 1
                  ? "Select dates to book" 
                  : "Book Now"}
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