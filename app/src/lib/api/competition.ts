import { DERBY_API_URL } from "@/lib/config/apiConfig";

export async function getConfiguration() {
  const res = await fetch(`${DERBY_API_URL}/api/competition/laneconfig`);
  if (!res.ok) throw new Error("Failed to fetch configuration");
  return res.json();
}
export async function setConfiguration(data: { numLanes: number; usableLanes: number[] }) {
  const res = await fetch(`${DERBY_API_URL}/api/competition/laneconfig`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to set configuration");
  return res.json();
}
export async function updateConfiguration(data: { numLanes: number; usableLanes: number[] }) {
  const res = await fetch(`${DERBY_API_URL}/api/competition/laneconfig`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update configuration");
  return res.json();
}
export async function getTotalLanes() {
  const res = await fetch(`${DERBY_API_URL}/api/competition/total-lanes`);
  if (!res.ok) throw new Error("Failed to fetch total lanes");
  return res.json();
}
export async function setTotalLanes(numLanes: number) {
  const res = await fetch(`${DERBY_API_URL}/api/competition/total-lanes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numLanes }),
  });
  if (!res.ok) throw new Error("Failed to set total lanes");
  return res.json();
}
export async function updateTotalLanes(numLanes: number) {
  const res = await fetch(`${DERBY_API_URL}/api/competition/total-lanes`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numLanes }),
  });
  if (!res.ok) throw new Error("Failed to update total lanes");
  return res.json();
}
export async function getUsableLanes() {
  const res = await fetch(`${DERBY_API_URL}/api/competition/usable-lanes`);
  if (!res.ok) throw new Error("Failed to fetch usable lanes");
  return res.json();
}
export async function setUsableLanes(usableLanes: number[]) {
  const res = await fetch(`${DERBY_API_URL}/api/competition/usable-lanes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usableLanes }),
  });
  if (!res.ok) throw new Error("Failed to set usable lanes");
  return res.json();
}
export async function updateUsableLanes(usableLanes: number[]) {
  const res = await fetch(`${DERBY_API_URL}/api/competition/usable-lanes`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usableLanes }),
  });
  if (!res.ok) throw new Error("Failed to update usable lanes");
  return res.json();
}
export async function getMultipliers() {
  const res = await fetch(`${DERBY_API_URL}/api/competition/multipliers`);
  if (!res.ok) throw new Error("Failed to fetch multipliers");
  return res.json();
}
export async function setSemifinalMultiplier(multiplier: number) {
  const res = await fetch(`${DERBY_API_URL}/api/competition/semifinal-multiplier`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ multiplier }),
  });
  if (!res.ok) throw new Error("Failed to set semifinal multiplier");
  return res.json();
}
export async function updateSemifinalMultiplier(multiplier: number) {
  const res = await fetch(`${DERBY_API_URL}/api/competition/semifinal-multiplier`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ multiplier }),
  });
  if (!res.ok) throw new Error("Failed to update semifinal multiplier");
  return res.json();
}
export async function setFinalMultiplier(multiplier: number) {
  const res = await fetch(`${DERBY_API_URL}/api/competition/final-multiplier`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ multiplier }),
  });
  if (!res.ok) throw new Error("Failed to set final multiplier");
  return res.json();
}
export async function updateFinalMultiplier(multiplier: number) {
  const res = await fetch(`${DERBY_API_URL}/api/competition/final-multiplier`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ multiplier }),
  });
  if (!res.ok) throw new Error("Failed to update final multiplier");
  return res.json();
}
