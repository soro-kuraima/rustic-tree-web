import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

// This component will be used inside your HillStationLanding component
// Replace the existing "Property Features" section with this code

const PropertyFeaturesSection = ({ propertyData, imageUrls }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Feature-image pairs - one feature with two images
  const featureImagePairs = propertyData.features.map((feature, index) => {
    const startIdx = index * 2;
    return {
      feature,
      images: [
        imageUrls[startIdx % imageUrls.length],
        imageUrls[(startIdx + 1) % imageUrls.length]
      ]
    };
  });

  return (
    <section id="property" ref={sectionRef} className="py-24 px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold mb-16 text-center"
        >
          Your Stay
        </motion.h2>
        
        <div className="space-y-36">
          {featureImagePairs.map((pair, index) => (
            <FeatureImagePair 
              key={index} 
              feature={pair.feature} 
              images={pair.images} 
              index={index} 
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureImagePair = ({ feature, images, index, progress }) => {
  // Create staggered scroll-based animations
  const opacityValue = useTransform(
    progress,
    [index * 0.15, index * 0.15 + 0.1, index * 0.15 + 0.2, index * 0.15 + 0.3],
    [0, 1, 1, 0]
  );
  
  const yValue = useTransform(
    progress,
    [index * 0.15, index * 0.15 + 0.1, index * 0.15 + 0.2, index * 0.15 + 0.3],
    [100, 0, 0, -100]
  );

  const isEven = index % 2 === 0;

  return (
    <motion.div 
      style={{ opacity: opacityValue, y: yValue }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
    >
      {/* Text Feature */}
      <motion.div 
        className={`md:col-span-1 bg-black/30 backdrop-blur-sm p-8 rounded-lg shadow-lg ${isEven ? 'md:order-1' : 'md:order-2'}`}
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <p className="text-xl font-medium">{feature}</p>
      </motion.div>
      
      {/* Images */}
      <motion.div 
        className={`md:col-span-2 grid grid-cols-2 gap-4 ${isEven ? 'md:order-2' : 'md:order-1'}`}
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {images.map((imageUrl, imgIndex) => (
          <div 
            key={imgIndex}
            className="overflow-hidden rounded-lg shadow-xl h-48 md:h-64"
          >
            {imageUrl && (
              <img 
                src={imageUrl.url} 
                alt={`Property view ${index * 2 + imgIndex + 1}`} 
                className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
              />
            )}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default PropertyFeaturesSection;