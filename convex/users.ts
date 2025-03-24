import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

/**
 * Creates a new user in the database after Clerk authentication
 */
export const createUser = mutation({
  args: {
    email: v.string(),
    email_verified: v.boolean(),
    family_name: v.optional(v.string()),
    given_name: v.string(),
    issuer: v.string(),
    name: v.string(),
    primary_phone_number: v.string(),
    phone_number_verified: v.boolean(),
    picture_url: v.string(),
    subject: v.string(),
    tokenIdentifier: v.string(),
    updated_at: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (existingUser !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (existingUser.name !== args.name) {
        await ctx.db.patch(existingUser._id, { name: args.name });
      }

      return existingUser._id;
    }

    // Create the user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      email_verified: args.email_verified,
      family_name: args.family_name,
      given_name: args.given_name,
      issuer: args.issuer,
      name: args.name,
      phone_number: args.primary_phone_number,
      phone_number_verified: args.phone_number_verified,
      picture_url: args.picture_url,
      subject: args.subject,
      tokenIdentifier: args.tokenIdentifier,
      updated_at: args.updated_at,
    });

    return userId;
  },
});

/**
 * Gets a user by their Clerk token identifier
 */
export const getUserByToken = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();
    
    return user;
  },
});

/**
 * Updates an existing user's information
 */
export const updateUser = mutation({
  args: {
    tokenIdentifier: v.string(),
    userData: v.object({
      email: v.optional(v.string()),
      email_verified: v.optional(v.boolean()),
      family_name: v.optional(v.string()),
      given_name: v.optional(v.string()),
      name: v.optional(v.string()),
      phone_number_verified: v.optional(v.boolean()),
      picture_url: v.optional(v.string()),
      updated_at: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    return await ctx.db.patch(user._id, args.userData);
  },
});

/**
 * Gets a user by their ID
 */
export const getUserById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called getUserById without authentication present');
    }
    
    // Get the user by the user's ID
    const user = await ctx.db.get(args.id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Verify that the authenticated user is requesting their own data
    const authUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    
    if (!authUser || authUser._id !== user._id) {
      throw new Error('Not authorized to view this user');
    }
    
    return user;
  },
});