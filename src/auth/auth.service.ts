import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/loginDto';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { getDevice, hashedRefreshToken } from 'src/helper/commonHelper';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService

    ) { }

    // authenticate user 

    async login(loginDto: LoginDto, userAgent) {
        const user = await this.prisma.user.findUnique({ where: { email: loginDto.email } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // validate password
        const isValidPassword = await bcrypt.compare(loginDto.password, user.password);
        if (!isValidPassword) {
            throw new UnauthorizedException('Invalid password');
        }

        // save user login session in userSesison table
        const sessionId = crypto.randomUUID();
        const userPayload = { userId: user.id, role: user.role, email: user.email, sessionId }
        const accessToken = this.jwtService.sign(userPayload, {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: '30s'
        });

        const refreshToken = this.jwtService.sign(userPayload, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: '60s'
        });

        // hash refresh token
        const hashedToken = hashedRefreshToken(refreshToken);

        // identify device
        const device = getDevice(userAgent);


        await this.prisma.userSession.create({
            data: {
                sessionId,
                userId: user.id,
                device,
                refreshTokenHash: hashedToken,
                userAgent,
                expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            },
        });

        return { accessToken, refreshToken };

    }

    async logout(userId, sessionId) {
        await this.prisma.userSession.update({
            where: {
                sessionId,
                userId
            },
            data: {
                revokedAt: new Date()
            }
        });
    }

    async logoutFromAllDevice(userId) {
        await this.prisma.userSession.updateMany({
            where: {
                userId
            },
            data: {
                revokedAt: new Date()
            }
        })
    }

    async refreshToken(refreshToken) {
        // verify refresh token
        const decode = this.jwtService.verify(refreshToken, {
            secret: process.env.REFRESH_TOKEN_SECRET,

        })
        if (!decode) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const hashed = hashedRefreshToken(refreshToken);

        // find session in db
        const session = await this.prisma.userSession.findFirst({
            where: {
                refreshTokenHash: hashed,
                userId: decode.userId,
                revokedAt: null,
                expiresAt: {
                    gt: new Date()
                }
            }
        });

        if (!session) {
            throw new UnauthorizedException('session Expired please login!');
        }

        const newAccessToken = this.jwtService.sign({
            userId: decode.userId,
            role: decode.role,
            email: decode.email,
            sessionId: decode.sessionId
        }, {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: '10m'
        });

        return newAccessToken;
    }
}
