"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/lib/rbac";

const NAV_ITEMS = [
  {
    path: "/admin",
    label: "Dashboard",
    icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
    permission: PERMISSIONS.DASHBOARD,
  },
  {
    path: "/admin/products",
    label: "Products",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    permission: PERMISSIONS.PRODUCTS,
  },
  {
    path: "/admin/orders",
    label: "Orders",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
    permission: PERMISSIONS.ORDERS,
  },
  {
    path: "/admin/customers",
    label: "Customers",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    permission: PERMISSIONS.CUSTOMERS,
  },
  {
    path: "/admin/inventory",
    label: "Inventory Logs",
    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    permission: PERMISSIONS.INVENTORY,
  },
  {
    path: "/admin/analytics",
    label: "Pixel Analytics",
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    permission: PERMISSIONS.ANALYTICS,
  },
  {
    path: "/admin/roles",
    label: "Roles & Access",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    permission: PERMISSIONS.ROLES,
  },
  {
    path: "/admin/settings",
    label: "Settings",
    icon: "M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 2.06l-1.41-1.41-1.06 1.06a7.95 7.95 0 00-1.7-.98L17 6h-2l-.77 2.73c-.6.16-1.17.4-1.7.7L11 8H9l-.66 1.75c-.55.3-1.07.66-1.56 1.06L4.47 9.47 3.06 10.88 5.13 13c-.05.33-.08.66-.08 1s.03.67.08 1L3.06 16.12l1.41 1.41 1.87-1.87c.49.4 1.01.76 1.56 1.06L9 18h2l.77-2.73c.53.3 1.1.54 1.7.7L15 18h2l.77-2.73c.59-.17 1.16-.4 1.7-.7l1.87 1.87 1.41-1.41-2.07-2.07c.05-.33.08-.66.08-1s-.03-.67-.08-1l2.07-2.07z",
    permission: PERMISSIONS.ROLES,
  },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, hasPermission, logout } = useAuth();

  const isActive = (path) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname?.startsWith(path);
  };

  const visibleNav = NAV_ITEMS.filter((item) => hasPermission(item.permission));

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#1A1A1A] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E1A926]" />
      </div>
    );
  }

  if (!user || visibleNav.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md bg-white p-8 rounded-2xl border shadow-xl text-center space-y-4">
          <h2 className="text-xl font-bold font-serif text-[#F2F2F2]">
            Access Denied
          </h2>
          <p className="text-sm text-gray-500">
            Your account does not have admin permissions.
          </p>
          <Link
            href="/"
            className="btn btn-primary inline-block py-2 px-6 text-sm"
          >
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const roleLabel = user.roleId || user.role || "user";

  return (
    <div className="min-h-screen flex bg-gray-50 flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-[#0D0D0D] text-white flex flex-col border-r border-[#E1A926]/10 flex-shrink-0">
        <div className="p-6 border-b border-white/10 flex flex-col items-center gap-1.5">
          <Link
            href="/admin"
            className="font-serif font-bold text-lg tracking-wider text-white"
          >
            ANERA ADMIN
          </Link>
          <span className="text-[10px] text-[#E1A926] tracking-[0.2em] uppercase font-semibold">
            Store Controller
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {visibleNav.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-sans font-semibold rounded-xl transition-all ${
                isActive(item.path)
                  ? "bg-[#E1A926] text-[#0D0D0D] shadow-md"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={item.icon}
                />
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 text-center text-[10px] text-gray-400 font-sans">
          Anera Foods &copy; 2026
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-[#1A1A1A] border-b border-gray-700 px-6 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-[11px] font-bold text-gray-500 font-sans uppercase tracking-wider">
              {user.name}
            </span>
            <span className="text-[10px] bg-[#E1A926]/10 text-[#E1A926] px-2 py-0.5 rounded font-bold uppercase">
              {roleLabel}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-sans text-gray-400 hover:text-[#E1A926] underline"
            >
              View Shop
            </Link>
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/login");
              }}
              className="text-xs font-sans text-red-600 hover:underline"
            >
              Sign Out
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
