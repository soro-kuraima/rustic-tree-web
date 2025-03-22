import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();
      
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    
    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      profileImage: args.profileImage,
      createdAt: Date.now(),
    });
  },
});