"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { hasPermission as checkPermission } from "@/lib/rbac";

const AuthContext = createContext(null);

const REFRESH_INTERVAL_MS = 13 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef(null);

  const scheduleRefresh = useCallback(function refreshSession() {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    refreshTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/auth/refresh", { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken);
          setUser(data.user);
          refreshSession();
        } else {
          setAccessToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Silent refresh failed:", error);
        setAccessToken(null);
        setUser(null);
      }
    }, REFRESH_INTERVAL_MS);
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const data = await meRes.json();
          setUser(data.user);
        }

        const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setAccessToken(data.accessToken);
          setUser(data.user);
          scheduleRefresh();
        } else if (!meRes.ok) {
          setUser(null);
          setAccessToken(null);
        }
      } catch (error) {
        console.error("Restore session failed:", error);
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [scheduleRefresh]);

  const login = useCallback(async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    setAccessToken(data.accessToken);
    
    
    setUser(data.user);
    scheduleRefresh();
    return data.user;
  }, [scheduleRefresh]);

  const signup = useCallback(async (name, email, phone, password) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Signup failed");
    }

    setAccessToken(data.accessToken);
    setUser(data.user);
    scheduleRefresh();
    return data.user;
  }, [scheduleRefresh]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout request failed:", error);
    }

    setAccessToken(null);
    setUser(null);

    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const hasPermission = useCallback(
    (permission) => checkPermission(user?.permissions, permission),
    [user]
  );

  const permissions = user?.permissions ?? [];
  const roleId = user?.roleId || user?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        signup,
        logout,
        hasPermission,
        isAuthenticated: !!accessToken && !!user,
        isAdmin: permissions.includes("*") || roleId === "admin" || roleId === "superadmin",
        isSuperAdmin: permissions.includes("*") || roleId === "superadmin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
