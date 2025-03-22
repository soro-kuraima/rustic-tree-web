import { create } from 'zustand';
import { Room, DateRange } from '../types';

interface RoomFilters {
  type?: 'standard' | 'deluxe' | 'suite';
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  dateRange?: DateRange;
}

interface RoomState {
  rooms: Room[];
  featuredRooms: Room[];
  selectedRoom: Room | null;
  isLoading: boolean;
  error: string | null;
  filters: RoomFilters;
  
  fetchRooms: () => Promise<void>;
  fetchFeaturedRooms: () => Promise<void>;
  fetchRoomById: (id: string) => Promise<void>;
  setFilters: (filters: Partial<RoomFilters>) => void;
  clearFilters: () => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  rooms: [],
  featuredRooms: [],
  selectedRoom: null,
  isLoading: false,
  error: null,
  filters: {},
  
  fetchRooms: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock data - In production, this would be a Convex call
      const mockRooms: Room[] = [
        {
          id: '1',
          name: 'Mountain View Suite',
          description: 'Luxurious suite with a breathtaking view of the mountains. The room features a king-size bed, a spacious seating area, and a private balcony where you can enjoy your morning coffee while watching the sunrise over the hills.',
          shortDescription: 'Luxury suite with mountain views and private balcony',
          type: 'suite',
          price: 299,
          capacity: 2,
          size: 500,
          amenities: ['King Bed', 'Mountain View', 'Private Balcony', 'Mini Bar', 'Room Service', 'Air Conditioning', 'Free Wi-Fi'],
          images: ['/images/suite1.jpg', '/images/suite2.jpg', '/images/suite3.jpg'],
          featured: true,
        },
        {
          id: '2',
          name: 'Deluxe Valley Room',
          description: 'Comfortable deluxe room overlooking the valley. The room comes with a queen-size bed, a work desk, and large windows that offer panoramic views of the lush valley below.',
          shortDescription: 'Comfortable room with valley views',
          type: 'deluxe',
          price: 199,
          capacity: 2,
          size: 400,
          amenities: ['Queen Bed', 'Valley View', 'Work Desk', 'Air Conditioning', 'Free Wi-Fi', 'Tea/Coffee Maker'],
          images: ['/images/deluxe1.jpg', '/images/deluxe2.jpg'],
          featured: true,
        },
        {
          id: '3',
          name: 'Standard Garden Room',
          description: 'Cozy standard room with garden access. This room features two single beds, a small seating area, and direct access to our beautiful garden area.',
          shortDescription: 'Cozy room with garden access',
          type: 'standard',
          price: 149,
          capacity: 2,
          size: 300,
          amenities: ['Twin Beds', 'Garden View', 'Air Conditioning', 'Free Wi-Fi', 'Tea/Coffee Maker'],
          images: ['/images/standard1.jpg', '/images/standard2.jpg'],
          featured: false,
        },
      ];
      
      // Apply filters
      const { type, minPrice, maxPrice, capacity } = get().filters;
      let filteredRooms = [...mockRooms];
      
      if (type) {
        filteredRooms = filteredRooms.filter(room => room.type === type);
      }
      
      if (minPrice !== undefined) {
        filteredRooms = filteredRooms.filter(room => room.price >= minPrice);
      }
      
      if (maxPrice !== undefined) {
        filteredRooms = filteredRooms.filter(room => room.price <= maxPrice);
      }
      
      if (capacity !== undefined) {
        filteredRooms = filteredRooms.filter(room => room.capacity >= capacity);
      }
      
      set({ rooms: filteredRooms, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch rooms',
        isLoading: false,
      });
    }
  },
  
  fetchFeaturedRooms: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock featured rooms - This would come from Convex in production
      const featuredRooms: Room[] = [
        {
          id: '1',
          name: 'Mountain View Suite',
          description: 'Luxurious suite with a breathtaking view of the mountains. The room features a king-size bed, a spacious seating area, and a private balcony where you can enjoy your morning coffee while watching the sunrise over the hills.',
          shortDescription: 'Luxury suite with mountain views and private balcony',
          type: 'suite',
          price: 299,
          capacity: 2,
          size: 500,
          amenities: ['King Bed', 'Mountain View', 'Private Balcony', 'Mini Bar', 'Room Service', 'Air Conditioning', 'Free Wi-Fi'],
          images: ['/images/suite1.jpg', '/images/suite2.jpg', '/images/suite3.jpg'],
          featured: true,
        },
        {
          id: '2',
          name: 'Deluxe Valley Room',
          description: 'Comfortable deluxe room overlooking the valley. The room comes with a queen-size bed, a work desk, and large windows that offer panoramic views of the lush valley below.',
          shortDescription: 'Comfortable room with valley views',
          type: 'deluxe',
          price: 199,
          capacity: 2,
          size: 400,
          amenities: ['Queen Bed', 'Valley View', 'Work Desk', 'Air Conditioning', 'Free Wi-Fi', 'Tea/Coffee Maker'],
          images: ['/images/deluxe1.jpg', '/images/deluxe2.jpg'],
          featured: true,
        },
      ];
      
      set({ featuredRooms, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch featured rooms',
        isLoading: false,
      });
    }
  },
  
  fetchRoomById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock room details - This would come from Convex in production
      const mockRooms = [
        {
          id: '1',
          name: 'Mountain View Suite',
          description: 'Luxurious suite with a breathtaking view of the mountains. The room features a king-size bed, a spacious seating area, and a private balcony where you can enjoy your morning coffee while watching the sunrise over the hills.',
          shortDescription: 'Luxury suite with mountain views and private balcony',
          type: 'suite' as const,
          price: 299,
          capacity: 2,
          size: 500,
          amenities: ['King Bed', 'Mountain View', 'Private Balcony', 'Mini Bar', 'Room Service', 'Air Conditioning', 'Free Wi-Fi'],
          images: ['/images/suite1.jpg', '/images/suite2.jpg', '/images/suite3.jpg'],
          featured: true,
        },
        {
          id: '2',
          name: 'Deluxe Valley Room',
          description: 'Comfortable deluxe room overlooking the valley. The room comes with a queen-size bed, a work desk, and large windows that offer panoramic views of the lush valley below.',
          shortDescription: 'Comfortable room with valley views',
          type: 'deluxe' as const,
          price: 199,
          capacity: 2,
          size: 400,
          amenities: ['Queen Bed', 'Valley View', 'Work Desk', 'Air Conditioning', 'Free Wi-Fi', 'Tea/Coffee Maker'],
          images: ['/images/deluxe1.jpg', '/images/deluxe2.jpg'],
          featured: true,
        },
        {
          id: '3',
          name: 'Standard Garden Room',
          description: 'Cozy standard room with garden access. This room features two single beds, a small seating area, and direct access to our beautiful garden area.',
          shortDescription: 'Cozy room with garden access',
          type: 'standard' as const,
          price: 149,
          capacity: 2,
          size: 300,
          amenities: ['Twin Beds', 'Garden View', 'Air Conditioning', 'Free Wi-Fi', 'Tea/Coffee Maker'],
          images: ['/images/standard1.jpg', '/images/standard2.jpg'],
          featured: false,
        },
      ];
      
      const selectedRoom = mockRooms.find(room => room.id === id) || null;
      
      if (!selectedRoom) {
        throw new Error('Room not found');
      }
      
      set({ selectedRoom, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch room details',
        isLoading: false,
      });
    }
  },
  
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
    // Re-fetch rooms with new filters
    get().fetchRooms();
  },
  
  clearFilters: () => {
    set({ filters: {} });
    get().fetchRooms();
  },
}));