import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const deviceFingerprintTable = pgTable("device_fingerprint", {
  // Primary key (64 character digest)
  digestId: text("id").primaryKey(),

  // Screen information
  screenWidth: integer("screen_width").notNull(),
  screenHeight: integer("screen_height").notNull(),
  screenColorDepth: integer("screen_color_depth").notNull(),
  screenPixelRatio: integer("screen_pixel_ratio").notNull(),

  // CPU information
  cpuHardwareConcurrency: integer("cpu_hardware_concurrency").notNull(),

  // Memory information
  deviceMemory: integer("device_memory"),

  // OS information
  osPlatform: text("os_platform").notNull(),

  // Browser information
  browserLanguage: text("browser_language").notNull(),

  // Timezone
  timezone: text("timezone").notNull(),

  // Touch support
  maxTouchPoints: integer("max_touch_points").notNull(),

  webglVendor: text("webgl_vendor"),
  webglRenderer: text("webgl_renderer"),

  audioFingerprint: text("audio_fingerprint"),

  fonts: text("fonts").array().notNull(),

  hasBattery: boolean("has_battery").notNull(),
  userAgent: text("user_agent").notNull(),
  ip: text("ip").notNull(),
  ipCountry: text("ip_country"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type DeviceFingerprint = typeof deviceFingerprintTable.$inferInsert;
export type InsertDeviceFingerprint =
  typeof deviceFingerprintTable.$inferInsert;

export const realLikeDeviceTable = pgTable("real_like_device", {
  digestId: text("id").primaryKey(),
});

export type RealLikeDevice = typeof realLikeDeviceTable.$inferInsert;
export type InsertRealLikeDevice = typeof realLikeDeviceTable.$inferInsert;

export const allLikesCountTable = pgTable("all_likes_count", {
  count: integer("count").notNull().default(0).primaryKey(),
});

export type AllLikesCount = typeof allLikesCountTable.$inferInsert;
export type InsertAllLikesCount = typeof allLikesCountTable.$inferInsert;
