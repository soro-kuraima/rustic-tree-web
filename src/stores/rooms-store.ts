import { create } from 'zustand';
import { Room, RoomType } from '../types';

interface RoomsFilters {
  type?: RoomType;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
}

interface RoomsState {
  rooms: Room[];
  featuredRooms: Room[];
  selectedRoom: Room | null;
  filters: RoomsFilters;
  isLoading: boolean;
  error: string | null;

  setRooms: (rooms: Room[]) => void;
  setFeaturedRooms: (rooms: Room[]) => void;
  setSelectedRoom: (room: Room | null) => void;
  setFilters: (filters: Partial<RoomsFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRoomsStore = create<RoomsState>((set) => ({
  rooms: [],
  featuredRooms: [],
  selectedRoom: null,
  filters: {},
  isLoading: false,
  error: null,

  setRooms: (rooms) => set({ rooms }),
  setFeaturedRooms: (rooms) => set({ featuredRooms: rooms }),
  setSelectedRoom: (room) => set({ selectedRoom: room }),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  clearFilters: () => set({ filters: {} }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));