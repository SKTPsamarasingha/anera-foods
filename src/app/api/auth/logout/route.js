import { NextResponse } from "next/server";
import { buildClearAuthCookies } from "@/lib/auth";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logged out successfully" });
    for (const cookie of buildClearAuthCookies()) {
      response.headers.append("Set-Cookie", cookie);
    }
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
