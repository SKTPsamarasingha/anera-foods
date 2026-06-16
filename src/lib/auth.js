// JWT Authentication Helpers (Edge-compatible using jose)
// Access token: { uuid, role } - 15 min expiry
// Refresh token: { uuid } - 7 day expiry, stored in HttpOnly cookie

import { SignJWT, jwtVerify } from "jose";

// Secret keys derived from environment variable or fallback for development
const getAccessSecret = () => {
  const secret = process.env.JWT_ACCESS_SECRET || "anera-access-secret-dev-key-change-in-prod";
  return new TextEncoder().encode(secret);
};

const getRefreshSecret = () => {
  const secret = process.env.JWT_REFRESH_SECRET || "anera-refresh-secret-dev-key-change-in-prod";
  return new TextEncoder().encode(secret);
};

// Token lifetimes
export const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 minutes in seconds
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Sign a short-lived access token containing uuid, roleId, and permissions.
 * @param {{ uuid: string, roleId: string, permissions?: string[] }} payload
 * @returns {Promise<string>} Signed JWT string
 */
export async function signAccessToken({ uuid, roleId, permissions = [] }) {
  return new SignJWT({ uuid, roleId, permissions })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_MAX_AGE}s`)
    .setIssuer("anera-foods")
    .sign(getAccessSecret());
}

/**
 * Sign a long-lived refresh token containing only uuid.
 * @param {{ uuid: string }} payload
 * @returns {Promise<string>} Signed JWT string
 */
export async function signRefreshToken({ uuid }) {
  return new SignJWT({ uuid })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TOKEN_MAX_AGE}s`)
    .setIssuer("anera-foods")
    .sign(getRefreshSecret());
}

/**
 * Verify and decode an access token.
 * @param {string} token - The JWT string
 * @returns {Promise<{ uuid: string, role: string } | null>} Decoded payload or null
 */
export async function verifyAccessToken(token) {
  try {
    const { payload } = await jwtVerify(token, getAccessSecret(), {
      issuer: "anera-foods",
    });
    return {
      uuid: payload.uuid,
      roleId: payload.roleId,
      permissions: payload.permissions || [],
    };
  } catch (error) {
    return null;
  }
}

/**
 * Verify and decode a refresh token.
 * @param {string} token - The JWT string
 * @returns {Promise<{ uuid: string } | null>} Decoded payload or null
 */
export async function verifyRefreshToken(token) {
  try {
    const { payload } = await jwtVerify(token, getRefreshSecret(), {
      issuer: "anera-foods",
    });
    return { uuid: payload.uuid };
  } catch (error) {
    return null;
  }
}

/**
 * Build the Set-Cookie header value for the refresh token.
 * @param {string} token - Refresh JWT string
 * @returns {string} Cookie header value
 */
export function buildRefreshCookie(token) {
  const isProduction = process.env.NODE_ENV === "production";
  const parts = [
    `refreshToken=${token}`,
    `HttpOnly`,
    `Path=/`,
    `Max-Age=${REFRESH_TOKEN_MAX_AGE}`,
    `SameSite=Lax`,
  ];
  if (isProduction) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

/**
 * Build a Set-Cookie header that clears the refresh token.
 * @returns {string} Cookie header value that expires immediately
 */
export function buildClearRefreshCookie() {
  return "refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax";
}

function buildCookie(name, value, maxAge = REFRESH_TOKEN_MAX_AGE) {
  const isProduction = process.env.NODE_ENV === "production";
  const parts = [`${name}=${value}`, "Path=/", `Max-Age=${maxAge}`, "SameSite=Lax"];
  if (isProduction) parts.push("Secure");
  return parts.join("; ");
}

export function buildRoleCookie(roleId) {
  return buildCookie("userRole", roleId);
}

export function buildPermissionsCookie(permissions) {
  const encoded = encodeURIComponent(JSON.stringify(permissions));
  return buildCookie("userPermissions", encoded);
}

export function buildClearAuthCookies() {
  return [
    buildClearRefreshCookie(),
    "userRole=; Path=/; Max-Age=0; SameSite=Lax",
    "userPermissions=; Path=/; Max-Age=0; SameSite=Lax",
  ];
}
