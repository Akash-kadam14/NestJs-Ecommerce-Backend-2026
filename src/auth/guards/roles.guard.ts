import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRoles } from '../enum/roles.enum';
import { ROLES_KEY } from "../customDecorator/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // get the require roles from metadata we set in roles decorator
        // getAllAndOverride() ka behaviour: Pehle handler/method check karo.
        // Agar wahan metadata mila, use use karo. Otherwise controller/class ka metadata use karo.
        // here getHandler() -> "controllers ke methods ko" refer kar raha hai
        // and getClass() -> "controllers ke class ko" refer kar raha hai
        const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
        // If no @Roles() metadata is defined on the route, skip authorization.
        if (!requiredRoles) {
            return true;
        }
        const req = context.switchToHttp().getRequest();
        // get userRole from request
        const userRole = req.user.role
        // check if user role is in the required roles
        return requiredRoles.some((role) => userRole === role);
    }
}