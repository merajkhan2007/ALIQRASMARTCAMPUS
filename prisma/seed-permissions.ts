import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

// All feature keys that can be enabled/disabled per role
const ALL_FEATURES = [
  "overview", "users", "admissions", "students", "attendance", "teachers",
  "salary", "donations", "classes", "courses", "payments", "exams", "fees",
  "library", "notices", "blogs", "messages", "settings", "permissions"
];

const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: [
    "overview", "users", "admissions", "students", "attendance", "teachers",
    "salary", "donations", "classes", "courses", "payments", "exams", "fees",
    "library", "notices", "blogs", "messages", "settings"
  ],
  TEACHER: [
    "overview", "attendance", "exams", "salary", "notices", "classes"
  ],
  STUDENT: [
    "overview", "attendance", "exams", "fees", "notices"
  ],
  PARENT: [
    "overview", "fees", "notices"
  ],
  ACCOUNTANT: [
    "overview", "fees", "payments", "salary", "donations"
  ],
  COOK: [
    "overview", "salary"
  ],
  KHADIM: [
    "overview", "salary"
  ],
  HAFIZ: [
    "overview", "salary"
  ],
};

async function seedRolePermissions() {
  console.log("Seeding RolePermissions...");

  const roles = Object.keys(DEFAULT_ROLE_PERMISSIONS) as Role[];

  for (const role of roles) {
    const enabledFeatures = DEFAULT_ROLE_PERMISSIONS[role];

    for (const feature of ALL_FEATURES) {
      const enabled = enabledFeatures.includes(feature);

      await prisma.rolePermission.upsert({
        where: {
          role_feature: { role, feature },
        },
        create: { role, feature, enabled },
        update: { enabled },
      });
    }

    console.log(`  ✓ ${role}: ${enabledFeatures.length} features enabled`);
  }

  console.log("RolePermissions seeding complete.");
}

seedRolePermissions()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });