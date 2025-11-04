// Unified configuration updater
export async function updateConfiguration({ numLanes, usableLanes }: { numLanes: number; usableLanes: number[] }) {
  // Update total lanes and usable lanes in parallel
  await Promise.all([
    updateTotalLanes(numLanes),
    updateUsableLanes(usableLanes)
  ]);
  // Return updated config
  return getConfiguration();
}
// Unified configuration fetcher
export async function getConfiguration() {
  // Fetch total lanes, usable lanes, and optionally voting categories
  const [total, usable, cats] = await Promise.all([
    getTotalLanes(),
    getUsableLanes(),
    getVotingCategories()
  ]);
  return {
    numLanes: total.numLanes,
    usableLanes: usable.usableLanes,
    votingCategories: cats.categories || []
  };
}
// Voting Categories API (now at /api/voting/category)
export async function getVotingCategories() {
  const res = await fetch(`${DERBY_API_URL}/api/voting/category`);
  if (!res.ok) throw new Error("Failed to fetch voting categories");
  return res.json();
}

export type VotingCategoryInput = { name: string; description: string };

export async function setVotingCategories(categories: VotingCategoryInput[]) {
  // Fetch existing categories
  const existingRes = await fetch(`${DERBY_API_URL}/api/voting/category`);
  if (!existingRes.ok) throw new Error("Failed to fetch existing voting categories");
  const existing = await existingRes.json();
  const categoryList: { id?: number; name: string; description?: string }[] = Array.isArray(existing)
    ? existing
    : existing.categories || [];
  const existingNames = categoryList.map(cat => cat.name);

  // Delete categories not in the new list
  for (const cat of categoryList) {
    if (!categories.some(c => c.name === cat.name)) {
      if (cat.id !== undefined) {
        await fetch(`${DERBY_API_URL}/api/voting/category/${cat.id}`, {
          method: "DELETE",
        });
      }
    }
  }

  // Create or update categories
  for (const cat of categories) {
    const existingCat = categoryList.find(c => c.name === cat.name);
    if (!existingCat) {
      // Create new category
      await fetch(`${DERBY_API_URL}/api/voting/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cat.name, description: cat.description }),
      });
    } else if (existingCat.description !== cat.description) {
      // Update description if changed
      await fetch(`${DERBY_API_URL}/api/voting/category/${existingCat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: cat.description }),
      });
    }
  }

  // Return updated categories
  return getVotingCategories();
}

export async function updateVotingCategories(categories: string[]) {
  const res = await fetch(`${DERBY_API_URL}/api/voting/category`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categories }),
  });
  if (!res.ok) throw new Error("Failed to update voting categories");
  return res.json();
}
import { DERBY_API_URL } from "@/lib/config/apiConfig";
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
