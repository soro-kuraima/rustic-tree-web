import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Calendar, MapPin } from 'lucide-react';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative h-[90vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="/images/hero-bg.jpg" 
          alt="Hill Station Resort" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative container mx-auto h-full flex items-center">
        <motion.div 
          className="max-w-xl text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience Tranquility in the Hills
          </motion.h1>
          
          <motion.p 
            className="text-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Escape the ordinary and immerse yourself in the serene beauty of our mountain retreat. 
            Breathtaking views, luxurious accommodations, and unforgettable experiences await.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/rooms')}
              className="gap-2"
            >
              <Calendar className="h-5 w-5" />
              Book Your Stay
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10 gap-2"
              onClick={() => navigate('/location')}
            >
              <MapPin className="h-5 w-5" />
              Our Location
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Overlay Cards */}
      <div className="absolute bottom-0 left-0 right-0 container mx-auto -mb-20 hidden md:block">
        <div className="grid grid-cols-3 gap-4">
          {[
            { 
              icon: '🏔️', 
              title: 'Panoramic Views', 
              description: 'Wake up to breathtaking mountain vistas' 
            },
            { 
              icon: '🛏️', 
              title: 'Luxury Comfort', 
              description: 'Premium accommodations with modern amenities' 
            },
            { 
              icon: '🍽️', 
              title: 'Local Cuisine', 
              description: 'Experience authentic flavors of the mountains' 
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + (index * 0.2) }}
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;