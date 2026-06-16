import { cookies } from "next/headers";
import { verifyRefreshToken } from "@/lib/auth";
import { dbServer } from "@/lib/db-server";
import { hasPermission } from "@/lib/rbac";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const refreshCookie = cookieStore.get("refreshToken");

  if (!refreshCookie?.value) return null;

  const payload = await verifyRefreshToken(refreshCookie.value);
  if (!payload) return null;

  const user = await dbServer.getUserByUuid(payload.uuid);
  if (!user) return null;

  const role = await dbServer.getRoleById(user.roleId);
  const permissions = role?.permissions ?? [];

  return {
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    phone: user.phone,
    roleId: user.roleId,
    role: user.roleId,
    permissions,
  };
}

export async function requirePermission(permission) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.permissions, permission)) {
    return null;
  }
  return user;
}
