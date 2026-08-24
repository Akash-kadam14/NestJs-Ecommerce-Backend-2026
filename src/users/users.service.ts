import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUserDTO';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async createUser(createUserDto: CreateUserDto) {
        const { email } = createUserDto;
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const createUser = await this.prisma.user.create({
            data: { ...createUserDto, password: hashedPassword },
            omit: { password: true, createdAt: true, updatedAt: true }
        });
        return { message: 'User created successfully', data: createUser };
    }
}
