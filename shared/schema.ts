import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("GENERAL"), // GENERAL, ADMIN
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subcategories
export const subcategories = pgTable("subcategories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  image: text("image"),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Locations
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  country: varchar("country", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  address: text("address"),
  coordinates: text("coordinates"), // JSON string with lat/lng
  createdAt: timestamp("created_at").defaultNow(),
});

// Providers
export const providers = pgTable("providers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  providerType: varchar("provider_type", { length: 100 }).notNull(), // SUPERMARKET, ONLINE, MARKET, etc.
  locationId: integer("location_id").references(() => locations.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  image: text("image"),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  subcategoryId: integer("subcategory_id").references(() => subcategories.id).notNull(),
  brand: varchar("brand", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Product Variants
export const variants = pgTable("variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  color: varchar("color", { length: 100 }),
  unit: varchar("unit", { length: 50 }), // kg, litre, piece, etc.
  quantity: varchar("quantity", { length: 50 }), // 500g, 1kg, etc.
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Product-Provider junction table
export const productProviders = pgTable("product_providers", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  providerId: integer("provider_id").references(() => providers.id).notNull(),
  skuId: varchar("sku_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Prices
export const prices = pgTable("prices", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  variantId: integer("variant_id").references(() => variants.id),
  providerId: integer("provider_id").references(() => providers.id).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 5, scale: 2 }).default("0.00"), // percentage
  finalPrice: decimal("final_price", { precision: 10, scale: 2 }).notNull(),
  skuId: varchar("sku_id", { length: 255 }),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Watchlist
export const watchlist = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
  products: many(products),
}));

export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
  products: many(products),
}));

export const locationsRelations = relations(locations, ({ many }) => ({
  providers: many(providers),
}));

export const providersRelations = relations(providers, ({ one, many }) => ({
  location: one(locations, {
    fields: [providers.locationId],
    references: [locations.id],
  }),
  prices: many(prices),
  productProviders: many(productProviders),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
  variants: many(variants),
  prices: many(prices),
  productProviders: many(productProviders),
  watchlistEntries: many(watchlist),
}));

export const variantsRelations = relations(variants, ({ one, many }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
  prices: many(prices),
}));

export const productProvidersRelations = relations(productProviders, ({ one }) => ({
  product: one(products, {
    fields: [productProviders.productId],
    references: [products.id],
  }),
  provider: one(providers, {
    fields: [productProviders.providerId],
    references: [providers.id],
  }),
}));

export const pricesRelations = relations(prices, ({ one }) => ({
  product: one(products, {
    fields: [prices.productId],
    references: [products.id],
  }),
  variant: one(variants, {
    fields: [prices.variantId],
    references: [variants.id],
  }),
  provider: one(providers, {
    fields: [prices.providerId],
    references: [providers.id],
  }),
}));

export const watchlistRelations = relations(watchlist, ({ one }) => ({
  user: one(users, {
    fields: [watchlist.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [watchlist.productId],
    references: [products.id],
  }),
}));

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true, createdAt: true });
export const insertSubcategorySchema = createInsertSchema(subcategories).omit({ id: true, createdAt: true });
export const insertLocationSchema = createInsertSchema(locations).omit({ id: true, createdAt: true });
export const insertProviderSchema = createInsertSchema(providers).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertVariantSchema = createInsertSchema(variants).omit({ id: true, createdAt: true });
export const insertProductProviderSchema = createInsertSchema(productProviders).omit({ id: true, createdAt: true });
export const insertPriceSchema = createInsertSchema(prices).omit({ id: true, timestamp: true });
export const insertWatchlistSchema = createInsertSchema(watchlist).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Subcategory = typeof subcategories.$inferSelect;
export type InsertSubcategory = z.infer<typeof insertSubcategorySchema>;
export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Provider = typeof providers.$inferSelect;
export type InsertProvider = z.infer<typeof insertProviderSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Variant = typeof variants.$inferSelect;
export type InsertVariant = z.infer<typeof insertVariantSchema>;
export type ProductProvider = typeof productProviders.$inferSelect;
export type InsertProductProvider = z.infer<typeof insertProductProviderSchema>;
export type Price = typeof prices.$inferSelect;
export type InsertPrice = z.infer<typeof insertPriceSchema>;
export type WatchlistEntry = typeof watchlist.$inferSelect;
export type InsertWatchlistEntry = z.infer<typeof insertWatchlistSchema>;
