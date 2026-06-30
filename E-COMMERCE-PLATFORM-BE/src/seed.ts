import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AppModule } from "./app/app.module";
import { UsersService } from "./app/modules/users/users.service";
import {
  Product,
  ProductDocument,
  UserRole,
} from "./libs/shared/src/schemas";
import { hashValue } from "./libs/shared/src/utils";

interface SeedUser {
  email: string;
  password: string;
  role: UserRole;
}

type SeedProduct = Pick<
  Product,
  | "name"
  | "description"
  | "price"
  | "oldPrice"
  | "category"
  | "stock"
  | "rating"
  | "reviews"
>;

const SEED_PRODUCTS: SeedProduct[] = [
  { name: "Aero Wireless Headphones", description: "Adaptive noise cancellation, 40-hour battery and plush memory-foam earcups.", price: 199, oldPrice: 249, category: "Audio", stock: 42, rating: 4.8, reviews: 212 },
  { name: "Drift Bluetooth Speaker", description: "IPX7 waterproof speaker with 24-hour playback and deep bass.", price: 119, oldPrice: 0, category: "Audio", stock: 30, rating: 4.7, reviews: 301 },
  { name: "Echo Studio Monitors", description: "Reference-grade desktop monitors for mixing and listening.", price: 349, oldPrice: 399, category: "Audio", stock: 12, rating: 4.6, reviews: 64 },
  { name: "Nimbus Mechanical Keyboard", description: "Hot-swappable switches, RGB backlight and an aluminium frame.", price: 149, oldPrice: 179, category: "Computers", stock: 55, rating: 4.9, reviews: 540 },
  { name: "Vertex 4K Webcam", description: "4K sensor with auto-focus and dual noise-cancelling mics.", price: 89, oldPrice: 0, category: "Computers", stock: 70, rating: 4.5, reviews: 188 },
  { name: "Quartz USB-C Hub", description: "9-in-1 hub with HDMI, ethernet and 100W passthrough charging.", price: 59, oldPrice: 79, category: "Computers", stock: 90, rating: 4.4, reviews: 142 },
  { name: "Pulse Smartwatch S6", description: "AMOLED display, built-in GPS and 7-day battery life.", price: 329, oldPrice: 0, category: "Wearables", stock: 25, rating: 4.7, reviews: 148 },
  { name: "Stride Fitness Band", description: "Slim activity tracker with heart-rate and sleep insights.", price: 49, oldPrice: 69, category: "Wearables", stock: 120, rating: 4.3, reviews: 96 },
  { name: "Forge Gaming Mouse", description: "26K DPI optical sensor, ultralight shell and 8 programmable buttons.", price: 69, oldPrice: 89, category: "Gaming", stock: 64, rating: 4.8, reviews: 410 },
  { name: "Apex Gaming Headset", description: "Surround sound, detachable boom mic and breathable earpads.", price: 129, oldPrice: 0, category: "Gaming", stock: 38, rating: 4.6, reviews: 233 },
  { name: "Lumen Smart Lamp", description: "16 million colours, scenes and voice-assistant support.", price: 59, oldPrice: 79, category: "Home", stock: 80, rating: 4.6, reviews: 96 },
  { name: "Haven Smart Plug", description: "Energy monitoring smart plug with scheduling and away mode.", price: 24, oldPrice: 0, category: "Home", stock: 200, rating: 4.2, reviews: 318 },
  { name: "Crisp Mirrorless Camera", description: "24MP sensor with 4K60 video and in-body stabilisation.", price: 899, oldPrice: 999, category: "Cameras", stock: 8, rating: 4.9, reviews: 76 },
  { name: "Vista Action Cam", description: "Rugged 5K action camera with hypersmooth stabilisation.", price: 279, oldPrice: 319, category: "Cameras", stock: 18, rating: 4.5, reviews: 121 },
];

async function seedProducts(
  productModel: Model<ProductDocument>,
  logger: Logger,
): Promise<void> {
  const existing = await productModel.estimatedDocumentCount();
  if (existing > 0) {
    logger.log(`Products already seeded (${existing}), skipping.`);
    return;
  }

  await productModel.insertMany(SEED_PRODUCTS);
  logger.log(`Created ${SEED_PRODUCTS.length} products.`);
}

const SEED_USERS: SeedUser[] = [
  { email: "admin@elitecart.com", password: "Admin123!", role: UserRole.ADMIN },
  { email: "customer@elitecart.com", password: "Customer123!", role: UserRole.USER },
];

async function seedUsers(
  usersService: UsersService,
  logger: Logger,
): Promise<void> {
  for (const user of SEED_USERS) {
    const existing = await usersService.findByEmail(user.email);
    if (existing) {
      logger.log(`User already exists, skipping: ${user.email}`);
      continue;
    }

    await usersService.create({
      email: user.email,
      password: await hashValue(user.password),
      role: user.role,
    });
    logger.log(`Created ${user.role} user: ${user.email}`);
  }
}

async function bootstrap(): Promise<void> {
  const logger = new Logger("Seed");
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error", "warn", "log"],
  });

  try {
    await seedUsers(app.get(UsersService), logger);
    await seedProducts(
      app.get<Model<ProductDocument>>(getModelToken(Product.name)),
      logger,
    );
    logger.log("Seed complete.");
  } catch (error) {
    logger.error("Seed failed", error instanceof Error ? error.stack : error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

void bootstrap();
