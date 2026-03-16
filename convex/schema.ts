import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  casts: defineTable({
    authorUsername: v.string(),
    authorDisplayName: v.string(),
    authorAvatar: v.string(),
    content: v.string(),
    likes: v.number(),
    recasts: v.number(),
    replies: v.number(),
    timestamp: v.number(),
    hash: v.string(),
    isVerified: v.boolean(),
  }).index("by_likes", ["likes"])
    .index("by_timestamp", ["timestamp"]),
  savedCasts: defineTable({
    userId: v.id("users"),
    castId: v.id("casts"),
    savedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_and_cast", ["userId", "castId"]),
  refreshLog: defineTable({
    refreshedAt: v.number(),
    castCount: v.number(),
  }),
});
