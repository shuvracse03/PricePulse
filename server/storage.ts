import {
  users,
  categories,
  subcategories,
  locations,
  providers,
  products,
  variants,
  productProviders,
  prices,
  watchlist,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Subcategory,
  type InsertSubcategory,
  type Location,
  type InsertLocation,
  type Provider,
  type InsertProvider,
  type Product,
  type InsertProduct,
  type Variant,
  type InsertVariant,
  type ProductProvider,
  type InsertProductProvider,
  type Price,
  type InsertPrice,
  type WatchlistEntry,
  type InsertWatchlistEntry,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Subcategory operations
  getSubcategories(categoryId?: number): Promise<Subcategory[]>;
  getSubcategory(id: number): Promise<Subcategory | undefined>;
  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory>;

  // Location operations
  getLocations(): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;

  // Provider operations
  getProviders(): Promise<Provider[]>;
  createProvider(provider: InsertProvider): Promise<Provider>;

  // Product operations
  getProducts(categoryId?: number, subcategoryId?: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;

  // Variant operations
  getVariants(productId: number): Promise<Variant[]>;
  createVariant(variant: InsertVariant): Promise<Variant>;

  // Product-Provider operations
  createProductProvider(productProvider: InsertProductProvider): Promise<ProductProvider>;

  // Price operations
  getPrices(productId: number, variantId?: number): Promise<Price[]>;
  getPriceHistory(productId: number, days?: number): Promise<Price[]>;
  createPrice(price: InsertPrice): Promise<Price>;

  // Watchlist operations
  getWatchlist(userId: string): Promise<WatchlistEntry[]>;
  addToWatchlist(entry: InsertWatchlistEntry): Promise<WatchlistEntry>;
  removeFromWatchlist(userId: string, productId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Subcategory operations
  async getSubcategories(categoryId?: number): Promise<Subcategory[]> {
    if (categoryId) {
      return await db.select().from(subcategories).where(eq(subcategories.categoryId, categoryId));
    }
    return await db.select().from(subcategories);
  }

  async getSubcategory(id: number): Promise<Subcategory | undefined> {
    const [subcategory] = await db.select().from(subcategories).where(eq(subcategories.id, id));
    return subcategory;
  }

  async createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory> {
    const [newSubcategory] = await db.insert(subcategories).values(subcategory).returning();
    return newSubcategory;
  }

  // Location operations
  async getLocations(): Promise<Location[]> {
    return await db.select().from(locations);
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const [newLocation] = await db.insert(locations).values(location).returning();
    return newLocation;
  }

  // Provider operations
  async getProviders(): Promise<Provider[]> {
    return await db.select().from(providers);
  }

  async createProvider(provider: InsertProvider): Promise<Provider> {
    const [newProvider] = await db.insert(providers).values(provider).returning();
    return newProvider;
  }

  // Product operations
  async getProducts(categoryId?: number, subcategoryId?: number): Promise<Product[]> {
    if (subcategoryId) {
      return await db.select().from(products).where(eq(products.subcategoryId, subcategoryId));
    } else if (categoryId) {
      return await db.select().from(products).where(eq(products.categoryId, categoryId));
    }
    
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  // Variant operations
  async getVariants(productId: number): Promise<Variant[]> {
    return await db.select().from(variants).where(eq(variants.productId, productId));
  }

  async createVariant(variant: InsertVariant): Promise<Variant> {
    const [newVariant] = await db.insert(variants).values(variant).returning();
    return newVariant;
  }

  // Product-Provider operations
  async createProductProvider(productProvider: InsertProductProvider): Promise<ProductProvider> {
    const [newProductProvider] = await db.insert(productProviders).values(productProvider).returning();
    return newProductProvider;
  }

  // Price operations
  async getPrices(productId: number, variantId?: number): Promise<Price[]> {
    if (variantId) {
      return await db.select().from(prices)
        .where(and(eq(prices.productId, productId), eq(prices.variantId, variantId)))
        .orderBy(desc(prices.timestamp));
    }
    
    return await db.select().from(prices)
      .where(eq(prices.productId, productId))
      .orderBy(desc(prices.timestamp));
  }

  async getPriceHistory(productId: number, days = 30): Promise<Price[]> {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    return await db
      .select()
      .from(prices)
      .where(
        and(
          eq(prices.productId, productId),
          sql`${prices.timestamp} >= ${daysAgo}`
        )
      )
      .orderBy(desc(prices.timestamp));
  }

  async createPrice(price: InsertPrice): Promise<Price> {
    const [newPrice] = await db.insert(prices).values(price).returning();
    return newPrice;
  }

  // Watchlist operations
  async getWatchlist(userId: string): Promise<WatchlistEntry[]> {
    return await db.select().from(watchlist).where(eq(watchlist.userId, userId));
  }

  async addToWatchlist(entry: InsertWatchlistEntry): Promise<WatchlistEntry> {
    const [newEntry] = await db.insert(watchlist).values(entry).returning();
    return newEntry;
  }

  async removeFromWatchlist(userId: string, productId: number): Promise<void> {
    await db
      .delete(watchlist)
      .where(and(eq(watchlist.userId, userId), eq(watchlist.productId, productId)));
  }
}

export const storage = new DatabaseStorage();
