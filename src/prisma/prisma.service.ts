import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// PrismaService used as a wrapper for prisma client to use it in the application
@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        const connectionString = process.env.DATABASE_URL;
        // prismaPg used as adapter/bridge between postgresql pg driver and prisma client.
        const pgAdapter = new PrismaPg({
            connectionString,
        });

        super({ adapter: pgAdapter });

    }
}
