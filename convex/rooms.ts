import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {
    type: v.optional(v.union(v.literal("standard"), v.literal("deluxe"), v.literal("suite"))),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    capacity: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let rooms = await ctx.db.query("rooms").collect();
    
    // Apply filters
    if (args.type) {
      rooms = rooms.filter(room => room.type === args.type);
    }
    
    if (args.minPrice !== undefined) {
      rooms = rooms.filter(room => room.price >= Number(args.minPrice));
    }
    
    if (args.maxPrice !== undefined) {
      rooms = rooms.filter(room => room.price <= Number(args.maxPrice));
    }
    
    if (args.capacity !== undefined) {
      rooms = rooms.filter(room => room.capacity >= Number(args.capacity));
    }
    
    return rooms;
  },
});

export const getFeatured = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("rooms")
      .filter(q => q.eq(q.field("featured"), true))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});