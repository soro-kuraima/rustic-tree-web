import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useRoomsStore } from '../../stores/rooms-store';
import { RoomType } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';

const RoomFilters: React.FC = () => {
  const { filters, setFilters, clearFilters } = useRoomsStore();
  
  // Local state for form inputs
  const [localFilters, setLocalFilters] = useState({
    type: filters.type || undefined,
    minPrice: filters.minPrice || 0,
    maxPrice: filters.maxPrice || 1000,
    capacity: filters.capacity || 1,
  });

  const handleTypeChange = (value: RoomType | 'all') => {
    setLocalFilters({
      ...localFilters,
      type: value === 'all' ? undefined : value,
    });
  };

  const handlePriceChange = (value: number[]) => {
    setLocalFilters({
      ...localFilters,
      minPrice: value[0],
      maxPrice: value[1],
    });
  };

  const handleCapacityChange = (value: number[]) => {
    setLocalFilters({
      ...localFilters,
      capacity: value[0],
    });
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({
      type: undefined,
      minPrice: 0,
      maxPrice: 1000,
      capacity: 1,
    });
    clearFilters();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-6">Filter Rooms</h3>
          
          {/* Room Type Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Room Type</h4>
            <RadioGroup 
              value={localFilters.type || 'all'} 
              onValueChange={(value) => handleTypeChange(value as RoomType | 'all')}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Types</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard">Standard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="deluxe" id="deluxe" />
                <Label htmlFor="deluxe">Deluxe</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suite" id="suite" />
                <Label htmlFor="suite">Suite</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Price Range Filter */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <h4 className="text-sm font-medium">Price Range</h4>
              <span className="text-sm text-gray-500">
                ${localFilters.minPrice} - ${localFilters.maxPrice}
              </span>
            </div>
            <Slider
              defaultValue={[localFilters.minPrice, localFilters.maxPrice]}
              max={1000}
              step={50}
              onValueChange={handlePriceChange}
              className="mt-4"
            />
          </div>
          
          {/* Capacity Filter */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <h4 className="text-sm font-medium">Guests</h4>
              <span className="text-sm text-gray-500">
                {localFilters.capacity} {localFilters.capacity === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>
            <Slider
              defaultValue={[localFilters.capacity]}
              min={1}
              max={6}
              step={1}
              onValueChange={handleCapacityChange}
              className="mt-4"
            />
          </div>
          
          {/* Filter Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              onClick={handleApplyFilters} 
              className="flex-1"
            >
              Apply Filters
            </Button>
            <Button 
              onClick={handleClearFilters} 
              variant="outline" 
              className="flex-1"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RoomFilters;