import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import PageContainer from '../components/layout/PageContainer';
import RoomFilters from '../components/rooms/RoomFilters';
import RoomList from '../components/rooms/RoomList';
import { useClerkUserSync } from '../hooks/useClerkUserSync';

const RoomPage: React.FC = () => {
  // Sync the user data with Convex
  useClerkUserSync();

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-8 px-4"
      >
        <div className="mb-8">
          <motion.h1 
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Accommodations
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <RoomFilters />
          </div>
          <div className="lg:col-span-3">
            <RoomList />
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
};

export default RoomPage;