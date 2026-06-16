import { NextResponse } from "next/server";
import { dbServer } from "@/lib/db-server";
import { getSessionUser } from "@/lib/session";
import { hasPermission, PERMISSIONS } from "@/lib/rbac";

const PUBLIC_ACTIONS = new Set([
  "getProducts",
  "getProductById",
  "createOrder",
  "logPixelEvent",
  "trackOrder",
]);

const AUTHENTICATED_ACTIONS = new Set(["getOrdersByCustomer"]);

const ACTION_PERMISSIONS = {
  getOrders: PERMISSIONS.ORDERS,
  getOrderById: PERMISSIONS.ORDERS,
  updateOrderStatus: PERMISSIONS.ORDERS,
  saveProduct: PERMISSIONS.PRODUCTS,
  archiveProduct: PERMISSIONS.PRODUCTS,
  getInventoryLogs: PERMISSIONS.INVENTORY,
  getPixelLogs: PERMISSIONS.ANALYTICS,
  getAllUsers: PERMISSIONS.ROLES,
  updateUserRole: PERMISSIONS.ROLES,
  getRoles: PERMISSIONS.ROLES,
  getRoleById: PERMISSIONS.ROLES,
  createRole: PERMISSIONS.ROLES,
  updateRole: PERMISSIONS.ROLES,
  deleteRole: PERMISSIONS.ROLES,
  seedDatabase: PERMISSIONS.ROLES,
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, args = [] } = body;

    if (!action || typeof dbServer[action] !== "function") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (!dbServer[action]) {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    if (AUTHENTICATED_ACTIONS.has(action)) {
      const user = await getSessionUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const result = await dbServer[action](user.uuid, ...args);
      return NextResponse.json({ result });
    }

    if (!PUBLIC_ACTIONS.has(action)) {
      const required = ACTION_PERMISSIONS[action];
      if (!required) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const user = await getSessionUser();
      if (!user || !hasPermission(user.permissions, required)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const result = await dbServer[action](...args);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("DB API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
