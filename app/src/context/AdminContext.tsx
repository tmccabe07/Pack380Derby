"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useSearchParams } from "next/navigation";

interface AdminContextValue {
  isAdmin: boolean;
  /** Append admin=true when currently admin */
  withAdmin(path: string): string;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const params = useSearchParams();
  // Check sessionStorage first
  let sessionAdmin: string | null = null;
  if (typeof window !== "undefined") {
    sessionAdmin = window.sessionStorage.getItem("isAdmin");
  }
  let isAdmin = sessionAdmin === "true";
  // If URL param is present, update sessionStorage
  if (params.get("admin") === "true") {
    isAdmin = true;
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("isAdmin", "true");
    }
  } else if (params.get("admin") === "false") {
    isAdmin = false;
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("isAdmin", "false");
    }
  }

  const value = useMemo<AdminContextValue>(() => ({
    isAdmin,
    withAdmin: (path: string) => {
      if (!isAdmin) return path;
      // If path already has query params, append with &; else ?
      return path.includes("?") ? `${path}&admin=true` : `${path}?admin=true`;
    },
  }), [isAdmin]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export function useAdminContext(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdminContext must be used within AdminProvider");
  return ctx;
}
