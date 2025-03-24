import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const getUserBookings = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called getUserBookings without authentication present');
    }
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called createBookings without authentication present');
    }
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called checkAvailability without authentication present');
    }
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

/**
 * Get a specific booking by ID
 */
export const getById = query({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called getById without authentication present');
    }
    
    const booking = await ctx.db.get(args.id);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Check if user owns this booking
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", `clerk:${identity.subject}`))
      .unique();
    
    if (!user || booking.userId !== user._id) {
      throw new Error('Not authorized to view this booking');
    }
    
    return booking;
  },
});

/**
 * Get recent bookings for a user with a limit
 */
export const getRecentUserBookings = query({
  args: { 
    userId: v.id("users"),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called getRecentUserBookings without authentication present');
    }
    
    // Default limit to 5 if not provided
    const limit = args.limit || 5;
    
    return await ctx.db
      .query("bookings")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .take(limit);
  },
});

/**
 * Cancel a booking
 */
export const cancelBooking = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called cancelBooking without authentication present');
    }
    
    const booking = await ctx.db.get(args.id);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Check if user owns this booking
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", `clerk:${identity.subject}`))
      .unique();

      console.log(identity)
      console.log(user);
      console.log(booking);
    
    if (!user || booking.userId !== user._id) {
      throw new Error('Not authorized to cancel this booking');
    }
    
    // Check if booking can be cancelled
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      throw new Error('This booking cannot be cancelled');
    }
    
    // Update booking status
    return await ctx.db.patch(args.id, { status: 'cancelled' });
  },
});

export const confirmBooking = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called confirmBooking without authentication present');
    }
    
    const booking = await ctx.db.get(args.id);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Check if user owns this booking
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", `clerk:${identity.subject}`))
      .unique();
    
    if (!user || booking.userId !== user._id) {
      throw new Error('Not authorized to confirmed this booking');
    }

    if (booking.status !== 'pending' && booking.status !== 'completed') {
      throw new Error('This booking cannot be confirmed');
    }

    return await ctx.db.patch(args.id, { status: 'confirmed' });
  }
})

export const completeBooking = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called completeBooking without authentication present');
    }
    
    const booking = await ctx.db.get(args.id);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Check if user owns this booking
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", `clerk:${identity.subject}`))
      .unique();
    
    if (!user || booking.userId !== user._id) {
      throw new Error('Not authorized to cancel this booking');
    }

    if (booking.status !== 'completed') {
      throw new Error('This booking cannot be completed');
    }

    return await ctx.db.patch(args.id, { status: 'completed' });
  }
})