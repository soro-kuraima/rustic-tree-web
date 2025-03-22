// src/components/home/Testimonials.tsx
import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    text: "Our stay at the hill station resort exceeded all expectations. The room was immaculate, the views breathtaking, and the staff went above and beyond to make our anniversary special.",
    author: "Sarah & James Thompson",
    location: "New York, USA",
    avatar: "/images/avatars/avatar-1.jpg"
  },
  {
    text: "I've traveled extensively, but few places offer the perfect blend of luxury and nature like this resort. The mountain air, comfortable beds, and farm-to-table dining were highlights of our trip.",
    author: "Michael Chen",
    location: "Toronto, Canada",
    avatar: "/images/avatars/avatar-2.jpg"
  },
  {
    text: "A truly magical experience. The rooms are spacious and beautifully designed, the surrounding trails are perfect for morning hikes, and the staff remembered our preferences from day one.",
    author: "Emma Rodriguez",
    location: "London, UK",
    avatar: "/images/avatars/avatar-3.jpg"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">What Our Guests Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what past visitors have experienced during their stay with us.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-6 rounded-lg relative"
            >
              <Quote className="h-10 w-10 text-primary/20 absolute top-6 right-6" />
              <p className="text-gray-700 mb-6 relative z-10">"{testimonial.text}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;