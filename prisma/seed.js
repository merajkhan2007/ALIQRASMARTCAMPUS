const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: "admin@aliqra.edu" },
    });

    if (existingAdmin) {
        console.log("Admin user already exists. Skipping creation.");
        return;
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    const admin = await prisma.user.create({
        data: {
            name: "Super Admin",
            email: "admin@aliqra.edu",
            password: hashedPassword,
            role: "SUPER_ADMIN",
        },
    });

    console.log(`Created admin user: ${admin.email}`);
    console.log("Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error("Error seeding database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
