// convex/files.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getBatchFileUrls = query({
  args: { storageIds: v.array(v.id("_storage")) },
  handler: async (ctx, args) => {
    return Promise.all(
      args.storageIds.map(async (id) => ({
        id,
        url: await ctx.storage.getUrl(id)
      }))
    );
  },
});