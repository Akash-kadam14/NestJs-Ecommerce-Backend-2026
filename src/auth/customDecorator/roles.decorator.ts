import { SetMetadata } from "@nestjs/common";
import { UserRoles } from '../enum/roles.enum';

// 1. Define the key
export const ROLES_KEY = 'roles';
// 2. Create the decorator
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);