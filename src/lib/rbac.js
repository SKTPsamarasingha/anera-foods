// Role-based access control — permissions and route guards

export const PERMISSIONS = {
  DASHBOARD: "admin.dashboard.view",
  PRODUCTS: "admin.products.manage",
  ORDERS: "admin.orders.manage",
  CUSTOMERS: "admin.customers.view",
  INVENTORY: "admin.inventory.view",
  ANALYTICS: "admin.analytics.view",
  ROLES: "admin.roles.manage",
  USERS: "admin.users.manage",
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const DEFAULT_ROLES = {
  superadmin: {
    id: "superadmin",
    name: "Super Admin",
    permissions: ["*"],
    isSystem: true,
  },
  admin: {
    id: "admin",
    name: "Admin",
    permissions: [
      PERMISSIONS.DASHBOARD,
      PERMISSIONS.PRODUCTS,
      PERMISSIONS.ORDERS,
      PERMISSIONS.CUSTOMERS,
      PERMISSIONS.INVENTORY,
    ],
    isSystem: true,
  },
  customer: {
    id: "customer",
    name: "Customer",
    permissions: [],
    isSystem: true,
  },
};

/** Map admin URL prefixes to required permission */
export const ADMIN_ROUTE_PERMISSIONS = [
  { prefix: "/admin/roles", permission: PERMISSIONS.ROLES },
  { prefix: "/admin/products", permission: PERMISSIONS.PRODUCTS },
  { prefix: "/admin/orders", permission: PERMISSIONS.ORDERS },
  { prefix: "/admin/customers", permission: PERMISSIONS.CUSTOMERS },
  { prefix: "/admin/inventory", permission: PERMISSIONS.INVENTORY },
  { prefix: "/admin/analytics", permission: PERMISSIONS.ANALYTICS },
  { prefix: "/admin", permission: PERMISSIONS.DASHBOARD },
];

export function hasPermission(permissions, required) {
  if (!permissions || !required) return false;
  if (permissions.includes("*")) return true;
  return permissions.includes(required);
}

export function getRequiredPermission(pathname) {
  const match = ADMIN_ROUTE_PERMISSIONS.find(({ prefix }) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  return match?.permission ?? PERMISSIONS.DASHBOARD;
}

export function parsePermissionsCookie(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return value.split(",").filter(Boolean);
  }
}
