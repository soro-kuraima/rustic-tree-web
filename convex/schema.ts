import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    profileImage: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
  
  rooms: defineTable({
    name: v.string(),
    description: v.string(),
    shortDescription: v.string(),
    type: v.union(v.literal("standard"), v.literal("deluxe"), v.literal("suite")),
    price: v.number(),
    capacity: v.number(),
    size: v.number(),
    amenities: v.array(v.string()),
    images: v.array(v.string()),
    featured: v.boolean(),
    discount: v.optional(v.number()),
  }).index("by_type", ["type"])
    .index("by_featured", ["featured"]),
    
  bookings: defineTable({
    userId: v.id("users"),
    roomId: v.id("rooms"),
    checkIn: v.number(), // timestamp
    checkOut: v.number(), // timestamp
    guests: v.number(),
    totalPrice: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    ),
    createdAt: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_roomId", ["roomId"])
    .index("by_status", ["status"]),
});