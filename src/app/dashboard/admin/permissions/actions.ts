"use server";

import { db } from "@/lib/db";
import { DEFAULT_ROLE_PERMISSIONS, ALL_FEATURES } from "@/lib/permissions";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Seed default role permissions for all non-SUPER_ADMIN roles.
 * Safe to call multiple times — upserts so won't create duplicates.
 */
export async function seedDefaultPermissions() {
  const roles = Object.keys(DEFAULT_ROLE_PERMISSIONS) as Role[];

  for (const role of roles) {
    const features = DEFAULT_ROLE_PERMISSIONS[role];
    
    for (const featureKey of ALL_FEATURES.map(f => f.key)) {
      const enabled = features.includes(featureKey);
      
      await db.rolePermission.upsert({
        where: {
          role_feature: { role, feature: featureKey },
        },
        create: { role, feature: featureKey, enabled },
        update: { enabled }, // update in case defaults changed
      });
    }
  }

  revalidatePath("/dashboard/admin/permissions");
  return { success: true };
}

/**
 * Fetch all permissions grouped by role.
 */
export async function getRolePermissions() {
  const permissions = await db.rolePermission.findMany({
    orderBy: [{ role: "asc" }, { feature: "asc" }],
  });

  const grouped: Record<string, Record<string, boolean>> = {};
  for (const p of permissions) {
    if (!grouped[p.role]) grouped[p.role] = {};
    grouped[p.role][p.feature] = p.enabled;
  }

  return {
    features: ALL_FEATURES.map(f => f.key),
    featureLabels: Object.fromEntries(ALL_FEATURES.map(f => [f.key, f.label])),
    permissions: grouped,
  };
}

/**
 * Update permissions for a specific role.
 */
export async function updateRolePermissions(
  role: string,
  permissions: { feature: string; enabled: boolean }[]
) {
  if (role === "SUPER_ADMIN") {
    return { error: "Cannot modify SUPER_ADMIN permissions." };
  }

  for (const perm of permissions) {
    await db.rolePermission.upsert({
      where: {
        role_feature: { role: role as Role, feature: perm.feature },
      },
      create: {
        role: role as Role,
        feature: perm.feature,
        enabled: perm.enabled,
      },
      update: { enabled: perm.enabled },
    });
  }

  revalidatePath("/dashboard/admin/permissions");
  return { success: true };
}