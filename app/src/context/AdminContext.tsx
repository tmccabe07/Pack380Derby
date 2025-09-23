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
  const isAdmin = params.get("admin") === "true";

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
