import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../schemas";

export const ROLES_KEY = "roles";

/**
 * Attaches the set of roles allowed to call a route. Read by `RolesGuard`.
 * Apply alongside `JwtAuthGuard` so `request.user.role` is populated first.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
