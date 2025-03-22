export interface User {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    createdAt: Date;
  }
  
  export interface Room {
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    type: 'standard' | 'deluxe' | 'suite';
    price: number;
    capacity: number;
    size: number; // in sq ft
    amenities: string[];
    images: string[];
    featured: boolean;
    discount?: number;
    unavailableDates?: Date[];
  }
  
  export interface Booking {
    id: string;
    userId: string;
    roomId: string;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt: Date;
  }
  
  export interface FoodItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'beverages';
    image: string;
    vegetarian: boolean;
  }
  
  export interface FoodOrder {
    id: string;
    userId: string;
    bookingId: string;
    items: {
      itemId: string;
      quantity: number;
      price: number;
    }[];
    totalPrice: number;
    status: 'pending' | 'preparing' | 'delivered' | 'cancelled';
    createdAt: Date;
  }
  
  export interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
  }