import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            // Extract JWT from the Authorization: Bearer <token> header
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // The secret key used to sign the JWT. 
            // It MUST match the key used to sign the token in the login controller.
            secretOrKey: process.env.ACCESS_TOKEN_SECRET!,
        });
    }

    // The validate method is called by Passport.js after the token has been verified.
    validate(payload: any) {
        // The payload is the decoded JWT token (which contains { sub, username }).
        return payload;
    }
}