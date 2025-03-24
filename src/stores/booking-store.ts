import { create } from 'zustand';
import { Booking, DateRange } from '../types';
import { Id } from '../../convex/_generated/dataModel';

interface BookingState {
  bookings: Booking[];
  currentBooking: {
    roomId: Id<"rooms"> | null;
    dateRange: DateRange | null;
    guests: number;
    totalPrice: number;
  };
  isAvailable: boolean;
  isLoading: boolean;
  error: string | null;

  setBookings: (bookings: Booking[]) => void;
  setRoomId: (roomId: Id<"rooms"> | null) => void;
  setDateRange: (dateRange: DateRange | null) => void;
  setGuests: (guests: number) => void;
  setTotalPrice: (price: number) => void;
  setAvailability: (isAvailable: boolean) => void;
  clearCurrentBooking: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  currentBooking: {
    roomId: null,
    dateRange: null,
    guests: 1,
    totalPrice: 0,
  },
  isAvailable: false,
  isLoading: false,
  error: null,

  setBookings: (bookings) => set({ bookings }),
  setRoomId: (roomId) => set((state) => ({ 
    currentBooking: { ...state.currentBooking, roomId } 
  })),
  setDateRange: (dateRange) => set((state) => ({ 
    currentBooking: { ...state.currentBooking, dateRange } 
  })),
  setGuests: (guests) => set((state) => ({ 
    currentBooking: { ...state.currentBooking, guests } 
  })),
  setTotalPrice: (totalPrice) => set((state) => ({ 
    currentBooking: { ...state.currentBooking, totalPrice } 
  })),
  setAvailability: (isAvailable) => set({ isAvailable }),
  clearCurrentBooking: () => set({ 
    currentBooking: {
      roomId: null,
      dateRange: null,
      guests: 1,
      totalPrice: 0,
    },
    isAvailable: false 
  }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));