import { NextResponse } from "next/server";
import { dbServer } from "@/lib/db-server";
import { hashPassword } from "@/lib/crypt";
import {
  signAccessToken,
  signRefreshToken,
  buildRefreshCookie,
  buildRoleCookie,
  buildPermissionsCookie,
} from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existingUser = await dbServer.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const { hash, salt } = await hashPassword(password);

    const newUser = await dbServer.createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || "",
      passwordHash: hash,
      passwordSalt: salt,
      roleId: "customer",
    });

    if (!newUser) {
      return NextResponse.json(
        { error: "Failed to create account. Email may already be registered." },
        { status: 409 }
      );
    }

    const role = await dbServer.getRoleById(newUser.roleId);
    const permissions = role?.permissions ?? [];

    const accessToken = await signAccessToken({
      uuid: newUser.uuid,
      roleId: newUser.roleId,
      permissions,
    });
    const refreshToken = await signRefreshToken({ uuid: newUser.uuid });

    const response = NextResponse.json({
      accessToken,
      user: {
        uuid: newUser.uuid,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        roleId: newUser.roleId,
        role: newUser.roleId,
        permissions,
      },
    });

    response.headers.append("Set-Cookie", buildRefreshCookie(refreshToken));
    response.headers.append("Set-Cookie", buildRoleCookie(newUser.roleId));
    response.headers.append("Set-Cookie", buildPermissionsCookie(permissions));
    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
