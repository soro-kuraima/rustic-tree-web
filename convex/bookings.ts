import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const getUserBookings = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
    roomId: v.id("rooms"),
    checkIn: v.number(),
    checkOut: v.number(),
    guests: v.number(),
    totalPrice: v.number(),
  },
  handler: async (ctx, args) => {
    // Check availability
    const existingBookings = await ctx.db
      .query("bookings")
      .filter(q => q.eq(q.field("roomId"), args.roomId))
      .filter(q => 
        q.or(
          q.and(
            q.gte(q.field("checkIn"), args.checkIn),
            q.lt(q.field("checkIn"), args.checkOut)
          ),
          q.and(
            q.gte(q.field("checkOut"), args.checkIn),
            q.lt(q.field("checkOut"), args.checkOut)
          ),
          q.and(
            q.lt(q.field("checkIn"), args.checkIn),
            q.gt(q.field("checkOut"), args.checkOut)
          )
        )
      )
      .filter(q => q.neq(q.field("status"), "cancelled"))
      .collect();
      
    if (existingBookings.length > 0) {
      throw new Error("Room is not available for selected dates");
    }
    
    return await ctx.db.insert("bookings", {
      userId: args.userId,
      roomId: args.roomId,
      checkIn: args.checkIn,
      checkOut: args.checkOut,
      guests: args.guests,
      totalPrice: args.totalPrice,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const checkAvailability = query({
  args: {
    roomId: v.id("rooms"),
    checkIn: v.number(),
    checkOut: v.number(),
  },
  handler: async (ctx, args) => {
    const existingBookings = await ctx.db
      .query("bookings")
      .filter(q => q.eq(q.field("roomId"), args.roomId))
      .filter(q => 
        q.or(
          q.and(
            q.gte(q.field("checkIn"), args.checkIn),
            q.lt(q.field("checkIn"), args.checkOut)
          ),
          q.and(
            q.gte(q.field("checkOut"), args.checkIn),
            q.lt(q.field("checkOut"), args.checkOut)
          ),
          q.and(
            q.lt(q.field("checkIn"), args.checkIn),
            q.gt(q.field("checkOut"), args.checkOut)
          )
        )
      )
      .filter(q => q.neq(q.field("status"), "cancelled"))
      .collect();
      
    return existingBookings.length === 0;
  },
});