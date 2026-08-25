import "dotenv/config";
import { PrismaClient } from "generated/prisma/client";
import bcrypt from 'bcrypt';
import { PrismaPg } from "@prisma/adapter-pg";


const prisma = new PrismaClient({
    adapter: new PrismaPg(process.env.DATABASE_URL!)
});

async function main() {
    const isAdminExist = await prisma.user.findUnique({ where: { email: process.env.ADMIN_EMAIL! } })

    if (isAdminExist) {
        console.log("Admin already exists. Skipping...");
        return;
    }

    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

    await prisma.user.create({
        data: {
            firstName: "Super",
            lastName: "Admin",
            email: process.env.ADMIN_EMAIL!,
            password: password,
            mobileNumber: "9874561230",
            role: "ADMIN",
            address: "123 Main Street, City",
        }

    })

}

main()
    .then(() => {
        console.log("Seed completed successfully");
    })
    .catch((e) => {
        console.error("Error in seed", e);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });