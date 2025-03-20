// schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    phone: v.optional(v.string()),
    profilePicture: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  rooms: defineTable({
    name: v.string(),
    description: v.string(),
    roomType: v.string(), // "standard", "deluxe", "premium"
    capacity: v.number(),
    pricePerNight: v.number(),
    amenities: v.array(v.string()),
    images: v.array(v.string()),
    isAvailable: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_room_type", ["roomType"]),

  bookings: defineTable({
    userId: v.id("users"),
    roomId: v.id("rooms"),
    checkInDate: v.number(), // Unix timestamp
    checkOutDate: v.number(), // Unix timestamp
    totalPrice: v.number(),
    numberOfGuests: v.number(),
    status: v.string(), // "pending", "confirmed", "cancelled", "completed"
    paymentStatus: v.string(), // "pending", "paid", "refunded"
    specialRequests: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_room", ["roomId"])
    .index("by_date_range", ["checkInDate", "checkOutDate"]),

  foodMenu: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(), // "breakfast", "lunch", "dinner", "snacks", "beverages"
    isAvailable: v.boolean(),
    image: v.optional(v.string()),
    preparationTime: v.number(), // in minutes
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_category", ["category"]),

  foodOrders: defineTable({
    userId: v.id("users"),
    bookingId: v.id("bookings"),
    items: v.array(
      v.object({
        menuItemId: v.id("foodMenu"),
        quantity: v.number(),
        specialInstructions: v.optional(v.string()),
      })
    ),
    totalPrice: v.number(),
    status: v.string(), // "pending", "preparing", "ready", "delivered", "cancelled"
    deliveryLocation: v.string(), // "room", "dining area", etc.
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_booking", ["bookingId"]),

  reviews: defineTable({
    userId: v.id("users"),
    bookingId: v.id("bookings"),
    roomId: v.id("rooms"),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_room", ["roomId"]),
});