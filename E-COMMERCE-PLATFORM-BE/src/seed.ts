import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { UsersService } from "./app/modules/users/users.service";
import { UserRole } from "./libs/shared/src/schemas";
import { hashValue } from "./libs/shared/src/utils";

interface SeedUser {
  email: string;
  password: string;
  role: UserRole;
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
    logger.log("Seed complete.");
  } catch (error) {
    logger.error("Seed failed", error instanceof Error ? error.stack : error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

void bootstrap();
