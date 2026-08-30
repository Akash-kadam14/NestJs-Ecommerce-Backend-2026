import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export interface JwtUserPayload {
    userId: string;
    sessionId: string;
    email: string;
    role: string;
}

export const CurrentUser = createParamDecorator((data: keyof JwtUserPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtUserPayload | undefined;
    return data ? user?.[data] : user;
})