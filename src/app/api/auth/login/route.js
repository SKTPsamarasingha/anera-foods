import { NextResponse } from "next/server";
import { dbServer } from "@/lib/db-server";
import { verifyPassword } from "@/lib/crypt";
import {
  signAccessToken,
  signRefreshToken,
  buildRefreshCookie,
  buildRoleCookie,
  buildPermissionsCookie,
} from "@/lib/auth";

async function buildAuthResponse(user) {
  const role = await dbServer.getRoleById(user.roleId);
  const permissions = role?.permissions ?? [];

  const accessToken = await signAccessToken({
    uuid: user.uuid,
    roleId: user.roleId,
    permissions,
  });
  const refreshToken = await signRefreshToken({ uuid: user.uuid });

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

  response.headers.append("Set-Cookie", buildRefreshCookie(refreshToken));
  response.headers.append("Set-Cookie", buildRoleCookie(user.roleId));
  response.headers.append("Set-Cookie", buildPermissionsCookie(permissions));
  return response;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await dbServer.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return buildAuthResponse(user);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
