// rooms.js
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getRooms = query({
  handler: async (ctx) => {
    return await ctx.db.query("rooms").collect();
  },
});

export const getRoomById = query({
  args: { id: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const checkRoomAvailability = query({
  args: {
    roomId: v.id("rooms"),
    checkInDate: v.number(),
    checkOutDate: v.number(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room?.isAvailable) {
      return { available: false, reason: "Room is not available for booking" };
    }

    // Check if there are any overlapping bookings
    const overlappingBookings = await ctx.db
      .query("bookings")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .filter((q) =>
        q.or(
          q.and(
            q.gte("checkInDate", args.checkInDate),
            q.lt("checkInDate", args.checkOutDate)
          ),
          q.and(
            q.gt("checkOutDate", args.checkInDate),
            q.lte("checkOutDate", args.checkOutDate)
          ),
          q.and(
            q.lte("checkInDate", args.checkInDate),
            q.gte("checkOutDate", args.checkOutDate)
          )
        )
      )
      .filter((q) => 
        q.neq("status", "cancelled")
      )
      .collect();

    return {
      available: overlappingBookings.length === 0,
      reason: overlappingBookings.length > 0 ? "Room is already booked for selected dates" : null,
    };
  },
});

// bookings.js
export const createBooking = mutation({
  args: {
    userId: v.id("users"),
    roomId: v.id("rooms"),
    checkInDate: v.number(),
    checkOutDate: v.number(),
    numberOfGuests: v.number(),
    specialRequests: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if room is available
    const availability = await ctx.runQuery("checkRoomAvailability", {
      roomId: args.roomId,
      checkInDate: args.checkInDate,
      checkOutDate: args.checkOutDate,
    });

    if (!availability.available) {
      throw new Error(availability.reason);
    }

    // Get room details for price calculation
    const room = await ctx.db.get(args.roomId);
    
    // Calculate number of nights
    const nights = Math.ceil((args.checkOutDate - args.checkInDate) / (1000 * 60 * 60 * 24));
    
    // Calculate total price
    const totalPrice = room.pricePerNight * nights;

    // Create booking
    const bookingId = await ctx.db.insert("bookings", {
      userId: args.userId,
      roomId: args.roomId,
      checkInDate: args.checkInDate,
      checkOutDate: args.checkOutDate,
      numberOfGuests: args.numberOfGuests,
      totalPrice,
      status: "pending",
      paymentStatus: "pending",
      specialRequests: args.specialRequests,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { bookingId, totalPrice };
  },
});

export const getUserBookings = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Fetch room details for each booking
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const room = await ctx.db.get(booking.roomId);
        return { ...booking, room };
      })
    );

    return bookingsWithDetails;
  },
});

// foodOrders.js
export const createFoodOrder = mutation({
  args: {
    userId: v.id("users"),
    bookingId: v.id("bookings"),
    items: v.array(
      v.object({
        menuItemId: v.id("foodMenu"),
        quantity: v.number(),
        specialInstructions: v.optional(v.string()),
      })
    ),
    deliveryLocation: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if booking exists and belongs to user
    const booking = await ctx.db.get(args.bookingId);
    if (!booking || booking.userId !== args.userId) {
      throw new Error("Invalid booking");
    }

    // Calculate total price
    let totalPrice = 0;
    for (const item of args.items) {
      const menuItem = await ctx.db.get(item.menuItemId);
      totalPrice += menuItem.price * item.quantity;
    }

    // Create food order
    const orderId = await ctx.db.insert("foodOrders", {
      userId: args.userId,
      bookingId: args.bookingId,
      items: args.items,
      totalPrice,
      status: "pending",
      deliveryLocation: args.deliveryLocation,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { orderId, totalPrice };
  },
});

// users.js
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      passwordHash: args.passwordHash,
      phone: args.phone,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { userId };
  },
});