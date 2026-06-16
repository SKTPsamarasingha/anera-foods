import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbServer } from "@/lib/db-server";
import {
  verifyRefreshToken,
  signAccessToken,
  buildRoleCookie,
  buildPermissionsCookie,
} from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshCookie = cookieStore.get("refreshToken");

    if (!refreshCookie?.value) {
      return NextResponse.json({ error: "No refresh token found" }, { status: 401 });
    }

    const payload = await verifyRefreshToken(refreshCookie.value);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
    }

    const user = await dbServer.getUserByUuid(payload.uuid);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const role = await dbServer.getRoleById(user.roleId);
    const permissions = role?.permissions ?? [];

    const accessToken = await signAccessToken({
      uuid: user.uuid,
      roleId: user.roleId,
      permissions,
    });

    const response = NextResponse.json({
      accessToken,
      user: {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roleId: user.roleId,
        role: user.roleId,
        permissions,
      },
    });

    response.headers.append("Set-Cookie", buildRoleCookie(user.roleId));
    response.headers.append("Set-Cookie", buildPermissionsCookie(permissions));
    return response;
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
