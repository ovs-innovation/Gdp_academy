export type Role = string;

export type Permission =
  | "dashboard.view"
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  | "members.view"
  | "members.create"
  | "members.edit"
  | "members.delete"
  | "roles.view"
  | "roles.manage"
  | "settings.view"
  | "settings.edit"
  | "analytics.view"
  | "reports.view"
  | "reports.export"
  | "teachers.view"
  | "teachers.manage"
  | "students.view"
  | "students.create"
  | "students.edit"
  | "students.delete"
  | "courses.view"
  | "courses.create"
  | "courses.edit"
  | "courses.delete"
  | "programs.view"
  | "programs.create"
  | "programs.edit"
  | "programs.delete"
  | "categories.view"
  | "categories.create"
  | "categories.edit"
  | "categories.delete"
  | "languages.view"
  | "languages.create"
  | "languages.edit"
  | "languages.delete"
  | "teacher_courses.view"
  | "teacher_courses.create"
  | "teacher_courses.approve"
  | "teacher_courses.delete"
  | "enquiries.view"
  | "enquiries.edit"
  | "enquiries.assign"
  | "enquiries.delete"
  | "payments.view"
  | "cms.view"
  | "cms.edit"
  | "blogs.view"
  | "blogs.create"
  | "blogs.edit"
  | "blogs.delete"
  | "gallery.view"
  | "gallery.create"
  | "gallery.edit"
  | "gallery.delete"
  | "faqs.view"
  | "faqs.create"
  | "faqs.edit"
  | "faqs.delete"
  | "testimonials.view"
  | "testimonials.create"
  | "testimonials.edit"
  | "testimonials.delete"
  | "membershipPlans.view"
  | "membershipPlans.create"
  | "membershipPlans.edit"
  | "membershipPlans.delete"
  | "pages.view"
  | "pages.create"
  | "pages.edit"
  | "pages.delete"
  | "contactMessages.view"
  | "contactMessages.create"
  | "announcements.view"
  | "announcements.manage"
  | "notifications.view"
  | "notifications.manage"
  | "profile.view"
  | "profile.edit"
  | "profile.own";

const defaultRoleMetadata: Record<
  string,
  {
    label: string;
    description: string;
    color: string;
  }
> = {
  super_admin: {
    label: "Super Admin",
    description: "Full system access",
    color: "bg-primary text-primary-foreground",
  },

  admin: {
    label: "Admin",
    description: "Administrative access",
    color: "bg-blue-500 text-white",
  },

  staff: {
    label: "Staff",
    description: "Enquiry handling access",
    color: "bg-cyan-500 text-white",
  },

  teacher: {
    label: "Teacher",
    description: "Teacher access",
    color: "bg-green-500 text-white",
  },

  student: {
    label: "Student",
    description: "Student access",
    color: "bg-purple-500 text-white",
  },
};

export const getRoleMetadata = (role: Role) =>
  defaultRoleMetadata[role] || {
    label: role,
    description: "",
    color: "bg-muted text-muted-foreground",
  };

export function hasPermission(
  permissions: Permission[],
  permission: Permission,
): boolean {
  return permissions.includes(permission);
}

export function hasAnyPermission(
  userPermissions: Permission[],
  perms: Permission[],
): boolean {
  return perms.some((p) => hasPermission(userPermissions, p));
}

export function hasAllPermissions(
  userPermissions: Permission[],
  perms: Permission[],
): boolean {
  return perms.every((p) => hasPermission(userPermissions, p));
}
