import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/loginDto';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { getDevice, hashedRefreshToken } from 'src/helper/commonHelper';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
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
            expiresIn: '10m'
        });

        const refreshToken = this.jwtService.sign(userPayload, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: '1d'
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
        await this.prisma.userSession.delete({
            where: {
                sessionId,
                userId
            }
        })
    }

    async logoutFromAllDevice(userId) {
        await this.prisma.userSession.deleteMany({
            where: {
                userId,

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

    @Cron(CronExpression.EVERY_HOUR)
    async cleanupExpiredSessions() {
        try {
            this.logger.log(`cron running....`);

            const result = await this.prisma.userSession.deleteMany({
                where: {
                    expiresAt: {
                        lt: new Date()
                    }
                }
            })
            this.logger.log(`Deleted ${result.count} expired sessions`);
        } catch (error) {
            this.logger.error('Failed to cleanup expired sessions', error.message);
        }
    }
}
