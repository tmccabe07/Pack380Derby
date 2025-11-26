import { DERBY_API_URL, DERBY_API_TOKEN } from "../config/apiConfig";

export async function fetchPinewoodAPI(path: string, options: RequestInit = {}) {
  const token = DERBY_API_TOKEN;

  console.log("Using DERBY_API_TOKEN:", token);
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };
  const url = `${DERBY_API_URL}${path}`;
  const res = await fetch(url, { ...options, headers });
  return res;
}
