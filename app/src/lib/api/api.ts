import { DERBY_API_URL, DERBY_API_TOKEN } from "../config/apiConfig";
import { getSessionPassword, getApiAuthToken } from "@/lib/auth/session";

export async function fetchPinewoodAPI(path: string, options: RequestInit = {}) {
  const sessionPassword = getSessionPassword();
  let authHeader = undefined;
  if (sessionPassword) {
    authHeader = `Bearer ${getApiAuthToken(sessionPassword)}`;
  } else if (DERBY_API_TOKEN) {
    authHeader = `Bearer ${DERBY_API_TOKEN}`;
  }

  const headers = {
    ...(options.headers || {}),
    ...(authHeader ? { Authorization: authHeader } : {}),
    "Content-Type": "application/json",
  };
  const url = `${DERBY_API_URL}${path}`;
  const res = await fetch(url, { ...options, headers });
  return res;
}
