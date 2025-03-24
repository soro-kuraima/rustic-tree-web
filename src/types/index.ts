import { Id } from "../../convex/_generated/dataModel";

export type User = {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  email_verified: boolean;
  family_name?: string;
  given_name?: string;
  issuer: string;
  name?: string;
  phone_number: string;
  phone_number_verified: boolean;
  picture_url?: string;
  subject?: string;
  tokenIdentifier: string;
  updated_at: string;
};

export type RoomType = "standard" | "deluxe" | "suite";

export type Room = {
  _id: Id<"rooms">;
  _creationTime: number;
  name: string;
  description: string;
  shortDescription: string;
  type: RoomType;
  price: number;
  capacity: number;
  size: number;
  amenities: string[];
  images: string[];
  featured: boolean;
  discount?: number;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type Booking = {
  _id: Id<"bookings">;
  _creationTime: number;
  userId: Id<"users">;
  roomId: Id<"rooms">;
  checkIn: number; // timestamp
  checkOut: number; // timestamp
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: number;
};

export type DateRange = {
  from: Date;
  to: Date;
};

export type PropertyData = {
  name: string;
  tagline: string;
  description: string;
  features: string[];
  surroundings: string[];
};

export type FileUrl = {
  url: string;
  storageId: string;
};