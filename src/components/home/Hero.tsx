import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { PropertyData } from '../../types';

interface HeroProps {
  propertyData: PropertyData;
}

const Hero: React.FC<HeroProps> = ({ propertyData }) => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-10" />
      
      {/* Background video or image */}
      <div className="absolute inset-0">
        <img 
          src="/api/placeholder/1920/1080" 
          alt="Mountain View" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center items-center h-full text-white px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-shadow">
            {propertyData.name}
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            {propertyData.tagline}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link to="/rooms">
            <Button 
              size="lg" 
              className="bg-amber-500 hover:bg-amber-400 text-black text-lg transition-all shadow-lg"
            >
              Explore Our Rooms
            </Button>
          </Link>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="animate-bounce">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;