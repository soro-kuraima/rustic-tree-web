import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Filter, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Slider } from '../../components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet';
import { formatCurrency } from '../../lib/utils';

const RoomFilters: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  
  // Local filter state
  const [type, setType] = useState<string | undefined>(searchParams.get('type') || undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('minPrice') || 0),
    Number(searchParams.get('maxPrice') || 500),
  ]);
  const [capacity, setCapacity] = useState<string | undefined>(searchParams.get('capacity') || undefined);
  
  // Update URL when filters change
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (type) params.set('type', type);
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 500) params.set('maxPrice', priceRange[1].toString());
    if (capacity) params.set('capacity', capacity);
    
    setSearchParams(params);
    setOpen(false);
  };
  
  const clearFilters = () => {
    setType(undefined);
    setPriceRange([0, 500]);
    setCapacity(undefined);
    setSearchParams(new URLSearchParams());
    setOpen(false);
  };
  
  // Count active filters
  const filterCount = [
    type,
    priceRange[0] > 0 || priceRange[1] < 500 ? 'price' : null,
    capacity,
  ].filter(Boolean).length;
  
  return (
    <div className="mb-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter Rooms
            {filterCount > 0 && (
              <span className="ml-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {filterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Rooms</SheetTitle>
            <SheetDescription>
              Adjust the filters to find your perfect accommodation
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Room Type</h3>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">Price Range</h3>
                <span className="text-sm text-gray-500">
                  {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                </span>
              </div>
              <Slider
                value={priceRange}
                min={0}
                max={500}
                step={10}
                onValueChange={setPriceRange}
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Capacity</h3>
              <Select value={capacity} onValueChange={setCapacity}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Capacity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Person</SelectItem>
                  <SelectItem value="2">2 People</SelectItem>
                  <SelectItem value="3">3 People</SelectItem>
                  <SelectItem value="4">4+ People</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <SheetFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RoomFilters;