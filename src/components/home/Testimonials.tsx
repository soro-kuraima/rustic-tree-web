import React from 'react';
import { motion } from 'motion/react';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  avatar: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Emma Thompson',
    position: 'Travel Blogger',
    avatar: '/api/placeholder/100/100',
    quote: 'The Rustic Ridge exceeded all my expectations. The views from our suite were breathtaking, and the staff went above and beyond to make our stay memorable.',
    rating: 5,
  },
  {
    id: 2,
    name: 'David Chen',
    position: 'Photographer',
    avatar: '/api/placeholder/100/100',
    quote: 'As a photographer, I was blown away by the natural beauty surrounding this property. The mountain sunrise views are simply unmatched anywhere else.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Sophia Rodriguez',
    position: 'Adventure Enthusiast',
    avatar: '/api/placeholder/100/100',
    quote: 'The perfect balance of luxury and adventure. After a day of hiking, coming back to such comfortable accommodations was exactly what we needed.',
    rating: 4,
  },
  {
    id: 4,
    name: 'Michael Johnson',
    position: 'Business Executive',
    avatar: '/api/placeholder/100/100',
    quote: 'I needed a peaceful retreat to disconnect from work, and The Rustic Ridge delivered exactly that. The tranquility and service were exceptional.',
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-stone-100">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">What Our Guests Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it, hear from travelers who have experienced 
            the magic of The Rustic Ridge
          </p>
        </motion.div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < testimonial.rating ? 'text-amber-500' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <blockquote className="mb-6 italic text-gray-700">"{testimonial.quote}"</blockquote>
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold">{testimonial.name}</p>
                          <p className="text-sm text-gray-500">{testimonial.position}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;