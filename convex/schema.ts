import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Billing: Maps Clerk userId to Dodo customerId
  customers: defineTable({
    authId: v.string(),
    email: v.string(),
    dodoCustomerId: v.string(),
    createdAt: v.number(),
  })
    .index("by_auth_id", ["authId"])
    .index("by_dodo_customer_id", ["dodoCustomerId"])
    .index("by_email", ["email"]),

  // Billing: Active subscription + credit balance + daily usage
  subscriptions: defineTable({
    userId: v.string(),
    plan: v.union(v.literal("starter"), v.literal("pro"), v.literal("scale")),
    status: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due")
    ),
    creditsMonthly: v.number(),
    currentBalance: v.float64(),
    dailyCap: v.number(),
    dailyTokenLimit: v.number(),
    dailyCreditsUsed: v.float64(),
    dailyTokensUsed: v.number(),
    lastDailyReset: v.number(),
    dodoCustomerId: v.string(),
    dodoSubscriptionId: v.string(),
    currentPeriodEnd: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_dodo_subscription_id", ["dodoSubscriptionId"])
    .index("by_status", ["status"]),

  // Billing: Ledger of all credit movements
  transactions: defineTable({
    userId: v.string(),
    type: v.union(
      v.literal("credit"),
      v.literal("debit"),
      v.literal("refund"),
      v.literal("grant")
    ),
    amount: v.float64(),
    description: v.string(),
    relatedTo: v.string(),
    inputTokens: v.optional(v.number()),
    outputTokens: v.optional(v.number()),
    balanceBefore: v.float64(),
    balanceAfter: v.float64(),
    timestamp: v.number(),
  }).index("by_user_id", ["userId"]),

  // Billing: One-time credit pack purchases
  creditPacks: defineTable({
    userId: v.string(),
    packSize: v.union(v.literal(50), v.literal(150), v.literal(400)),
    creditsGranted: v.number(),
    dodoPaymentId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed")
    ),
    timestamp: v.number(),
  }).index("by_user_id", ["userId"]),

  projects: defineTable({
    name: v.string(),
    ownerId: v.string(),
    updatedAt: v.number(),
    importStatus: v.optional(
      v.union(
        v.literal("importing"),
        v.literal("completed"),
        v.literal("failed"),
      ),
    ),
    exportStatus: v.optional(
      v.union(
        v.literal("exporting"),
        v.literal("completed"),
        v.literal("failed"),
        v.literal("cancelled"),
      ),
    ),
    exportRepoUrl: v.optional(v.string()),
    settings: v.optional(
      v.object({
        installCommand: v.optional(v.string()),
        devCommand: v.optional(v.string()),
      })
    ),
  }).index("by_owner", ["ownerId"]),

  files: defineTable({
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
    name: v.string(),
    type: v.union(v.literal("file"), v.literal("folder")),
    content: v.optional(v.string()), // Text files only
    storageId: v.optional(v.id("_storage")), // Binary files only
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_parent", ["parentId"])
    .index("by_project_parent", ["projectId", "parentId"]),

  conversations: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    updatedAt: v.number(),
  }).index("by_project", ["projectId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    projectId: v.id("projects"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    status: v.optional(
      v.union(
        v.literal("processing"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_project_status", ["projectId", "status"]),
});
