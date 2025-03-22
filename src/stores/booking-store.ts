import { create } from 'zustand';
import { DateRange } from '../types';

// This store only manages temporary booking state
// Actual booking data will be fetched directly from Convex
interface BookingState {
  currentBooking: {
    roomId: string | null;
    checkIn: Date | null;
    checkOut: Date | null;
    guests: number;
    totalPrice: number;
  };
  
  setBookingDetails: (details: Partial<BookingState['currentBooking']>) => void;
  clearBookingDetails: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  currentBooking: {
    roomId: null,
    checkIn: null,
    checkOut: null,
    guests: 1,
    totalPrice: 0,
  },
  
  setBookingDetails: (details) => {
    set((state) => ({
      currentBooking: { ...state.currentBooking, ...details },
    }));
  },
  
  clearBookingDetails: () => {
    set({
      currentBooking: {
        roomId: null,
        checkIn: null,
        checkOut: null,
        guests: 1,
        totalPrice: 0,
      },
    });
  },
}));