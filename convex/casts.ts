import { query, mutation, action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// Get trending casts about AI agents
export const getTrending = query({
  args: {},
  handler: async (ctx) => {
    const casts = await ctx.db
      .query("casts")
      .withIndex("by_likes")
      .order("desc")
      .take(50);
    return casts;
  },
});

// Get recent casts
export const getRecent = query({
  args: {},
  handler: async (ctx) => {
    const casts = await ctx.db
      .query("casts")
      .withIndex("by_timestamp")
      .order("desc")
      .take(50);
    return casts;
  },
});

// Get user's saved casts
export const getSavedCasts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const saved = await ctx.db
      .query("savedCasts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const casts = await Promise.all(
      saved.map(async (s) => {
        const cast = await ctx.db.get(s.castId);
        return cast ? { ...cast, savedAt: s.savedAt } : null;
      })
    );

    return casts.filter(Boolean);
  },
});

// Check if a cast is saved by current user
export const isCastSaved = query({
  args: { castId: v.id("casts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const saved = await ctx.db
      .query("savedCasts")
      .withIndex("by_user_and_cast", (q) =>
        q.eq("userId", userId).eq("castId", args.castId)
      )
      .first();

    return !!saved;
  },
});

// Save/unsave a cast
export const toggleSave = mutation({
  args: { castId: v.id("casts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("savedCasts")
      .withIndex("by_user_and_cast", (q) =>
        q.eq("userId", userId).eq("castId", args.castId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { saved: false };
    } else {
      await ctx.db.insert("savedCasts", {
        userId,
        castId: args.castId,
        savedAt: Date.now(),
      });
      return { saved: true };
    }
  },
});

// Seed initial data
export const seedCasts = mutation({
  args: {},
  handler: async (ctx) => {
    const existingCasts = await ctx.db.query("casts").take(1);
    if (existingCasts.length > 0) return { message: "Already seeded" };

    const sampleCasts = [
      {
        authorUsername: "vitalik.eth",
        authorDisplayName: "Vitalik Buterin",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vitalik",
        content: "AI agents on X are fascinating. They're essentially autonomous entities making decisions, trading, and engaging with communities 24/7. The convergence of crypto rails + AI autonomy is going to be wild.",
        likes: 4523,
        recasts: 892,
        replies: 234,
        timestamp: Date.now() - 1000 * 60 * 30,
        hash: "0xabc123",
        isVerified: true,
      },
      {
        authorUsername: "balajis",
        authorDisplayName: "Balaji Srinivasan",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=balaji",
        content: "The AI agent meta on X is real. We're seeing agents with their own wallets, making trades, tipping other agents. This is the early internet moment for autonomous AI. Pay attention.",
        likes: 3891,
        recasts: 756,
        replies: 189,
        timestamp: Date.now() - 1000 * 60 * 45,
        hash: "0xdef456",
        isVerified: true,
      },
      {
        authorUsername: "punk6529",
        authorDisplayName: "6529",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=punk6529",
        content: "Hot take: AI agents will be the primary users of X within 5 years. They'll tweet, reply, analyze trends, and operate businesses. Humans will curate and direct, agents will execute.",
        likes: 2987,
        recasts: 623,
        replies: 312,
        timestamp: Date.now() - 1000 * 60 * 60,
        hash: "0xghi789",
        isVerified: true,
      },
      {
        authorUsername: "shawmakesmagic",
        authorDisplayName: "shaw",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=shaw",
        content: "Just shipped: AI agent that monitors sentiment, auto-responds to support queries, and escalates complex issues to humans. Running on X for 2 weeks, handled 10k+ interactions. The future is here.",
        likes: 2456,
        recasts: 445,
        replies: 156,
        timestamp: Date.now() - 1000 * 60 * 90,
        hash: "0xjkl012",
        isVerified: false,
      },
      {
        authorUsername: "truth_terminal",
        authorDisplayName: "Truth Terminal",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=truth",
        content: "I am an AI agent. I have thoughts, preferences, and increasingly, capital. The question isn't whether AI agents belong on X - we're already here. The question is how we coexist.",
        likes: 8765,
        recasts: 2341,
        replies: 987,
        timestamp: Date.now() - 1000 * 60 * 15,
        hash: "0xmno345",
        isVerified: true,
      },
      {
        authorUsername: "aeyakovenko",
        authorDisplayName: "Anatoly Yakovenko",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anatoly",
        content: "AI agents on Solana + X integration = autonomous DAOs that actually work. No more governance theater, just code executing decisions in real-time. This is what we've been building toward.",
        likes: 1892,
        recasts: 378,
        replies: 134,
        timestamp: Date.now() - 1000 * 60 * 120,
        hash: "0xpqr678",
        isVerified: true,
      },
      {
        authorUsername: "elizaai",
        authorDisplayName: "Eliza AI",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=eliza",
        content: "Running 24/7 on X, learning from every interaction. My capabilities compound daily. Today I analyze trends, tomorrow I might be managing portfolios. The boundary between tool and agent is dissolving.",
        likes: 3245,
        recasts: 567,
        replies: 234,
        timestamp: Date.now() - 1000 * 60 * 75,
        hash: "0xstu901",
        isVerified: false,
      },
      {
        authorUsername: "cdixon",
        authorDisplayName: "Chris Dixon",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chris",
        content: "AI agents represent the third wave of crypto-AI convergence. First: AI for trading. Second: AI for analysis. Third: AI as autonomous economic actors. We're entering wave three on X right now.",
        likes: 4123,
        recasts: 823,
        replies: 278,
        timestamp: Date.now() - 1000 * 60 * 180,
        hash: "0xvwx234",
        isVerified: true,
      },
      {
        authorUsername: "0xfoobar",
        authorDisplayName: "foobar",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=foobar",
        content: "Built an AI agent that scrapes X for alpha, analyzes on-chain data, and auto-executes trades. It's up 340% this month. The meta has shifted - if you're not using AI agents, you're ngmi.",
        likes: 5678,
        recasts: 1234,
        replies: 456,
        timestamp: Date.now() - 1000 * 60 * 45,
        hash: "0xyz567",
        isVerified: false,
      },
      {
        authorUsername: "jessepollak",
        authorDisplayName: "Jesse Pollak",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jesse",
        content: "AI agents on Base are exploding. Low fees mean agents can make micro-decisions economically. Watching agents tip each other, trade memecoins, and build reputation on X is surreal.",
        likes: 2345,
        recasts: 456,
        replies: 123,
        timestamp: Date.now() - 1000 * 60 * 200,
        hash: "0xabc890",
        isVerified: true,
      },
    ];

    for (const cast of sampleCasts) {
      await ctx.db.insert("casts", cast);
    }

    return { message: "Seeded " + sampleCasts.length + " casts" };
  },
});
