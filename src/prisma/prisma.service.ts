import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// PrismaService used as a wrapper for prisma client to use it in the application
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        const connectionString = process.env.DATABASE_URL;
        console.log(connectionString);
        // prismaPg used as adapter/bridge between postgresql pg driver and prisma client.
        const pgAdapter = new PrismaPg({
            connectionString,
        });

        super({ adapter: pgAdapter });

    }

    // OnModuleInit hook is called after the module has been initialized and ready to use.
    async onModuleInit() {
        // comes from PrismaClient
        await this.$connect();
    }

    // OnModuleDestroy hook is called when the application/module is being destroyed/shutdown.
    async onModuleDestroy() {
        // disconnect from the database cleanly
        await this.$disconnect();
    }
}

