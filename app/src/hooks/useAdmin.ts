"use client";
import { useAdminContext } from "@/context/AdminContext";

export function useAdmin() {
  return useAdminContext();
}
