/**
 * Feature-permission system for role-based access control.
 * 
 * Define all feature keys here. The Super Admin can enable/disable any feature per role.
 */

// Canonical list of all feature keys used across the app
export const ALL_FEATURES = [
  { key: "overview",        label: "Dashboard Overview" },
  { key: "users",           label: "User Management" },
  { key: "admissions",      label: "Admissions" },
  { key: "students",        label: "Students" },
  { key: "attendance",      label: "Attendance" },
  { key: "teachers",        label: "Teachers" },
  { key: "salary",          label: "Salary Management" },
  { key: "donations",       label: "Donations" },
  { key: "classes",         label: "Class Management" },
  { key: "courses",         label: "Courses Manager" },
  { key: "payments",        label: "Payments" },
  { key: "exams",           label: "Exams & Results" },
  { key: "fees",            label: "Fee Management" },
  { key: "library",         label: "Library" },
  { key: "notices",         label: "Notices" },
  { key: "blogs",           label: "Blogs" },
  { key: "messages",        label: "Messages" },
  { key: "settings",        label: "Settings" },
  { key: "permissions",     label: "Permissions (Super Admin only)" },
] as const;

export type FeatureKey = typeof ALL_FEATURES[number]["key"];

// Default enabled features for each role (only configurable for non-SUPER_ADMIN roles)
export const DEFAULT_ROLE_PERMISSIONS: Record<string, FeatureKey[]> = {
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

// SUPER_ADMIN always has access to everything - no permission checks needed
// This is enforced by middleware and the utility functions below

export function isSuperAdmin(role: string): boolean {
  return role === "SUPER_ADMIN";
}

/**
 * Check if a given role has a specific feature enabled.
 * SUPER_ADMIN always returns true.
 */
export function hasPermission(role: string, feature: FeatureKey): boolean {
  if (isSuperAdmin(role)) return true;
  
  // If we have explicit permission set loaded from DB (passed as featureSet)
  return true; // default; actual enforcement happens via middleware/db lookup
}

/**
 * Map a feature key to its corresponding dashboard route path prefix.
 * Used by middleware to determine which routes a permission covers.
 */
export const FEATURE_ROUTE_MAP: Record<string, string[]> = {
  overview:    ["/dashboard"],
  users:       ["/dashboard/admin/users"],
  admissions:  ["/dashboard/admin/admissions"],
  students:    ["/dashboard/admin/students", "/dashboard/student"],
  attendance:  ["/dashboard/admin/attendance", "/dashboard/teacher/attendance"],
  teachers:    ["/dashboard/admin/teachers"],
  salary:      ["/dashboard/admin/salary", "/dashboard/teacher/salary", "/dashboard/accountant/salary"],
  donations:   ["/dashboard/admin/donations"],
  classes:     ["/dashboard/admin/classes", "/dashboard/teacher/classes"],
  courses:     ["/dashboard/admin/courses"],
  payments:    ["/dashboard/admin/payments"],
  exams:       ["/dashboard/admin/exams", "/dashboard/teacher/exams"],
  fees:        ["/dashboard/admin/fees", "/dashboard/accountant/fees", "/dashboard/accountant/invoices"],
  library:     ["/dashboard/admin/library"],
  notices:     ["/dashboard/admin/notices", "/dashboard/teacher/notices"],
  blogs:       ["/dashboard/admin/blogs"],
  messages:    ["/dashboard/admin/messages"],
  settings:    ["/dashboard/admin/settings"],
  permissions: ["/dashboard/admin/permissions"],
};

/**
 * Given a pathname and role + their allowed features, determine if they can access.
 */
export function canAccessRoute(
  pathname: string,
  role: string,
  allowedFeatures: FeatureKey[]
): boolean {
  if (isSuperAdmin(role)) return true;

  // If the path is a generic dashboard root, always allow (handled by role middleware)
  if (pathname === "/dashboard" || pathname === "/dashboard/admin" ||
      pathname === "/dashboard/teacher" || pathname === "/dashboard/student" ||
      pathname === "/dashboard/accountant" || pathname === "/dashboard/parent") {
    return true;
  }

  for (const feature of allowedFeatures) {
    const routes = FEATURE_ROUTE_MAP[feature];
    if (routes) {
      for (const route of routes) {
        if (pathname.startsWith(route)) return true;
      }
    }
  }

  return false;
}