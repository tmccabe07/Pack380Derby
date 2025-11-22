import { DERBY_API_URL } from "@/lib/config/apiConfig";
import type { VoteSubmission } from "@/types/VoteSubmission";

// Submit a vote for a car in a category, with voterIdentifier
export async function submitVote(vote: VoteSubmission) {
  const res = await fetch(`${DERBY_API_URL}/api/voting`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vote),
  });
  if (!res.ok) throw new Error("Failed to submit vote");
  return res.json();
}

// Get all votes
export async function getVotes() {
  const res = await fetch(`${DERBY_API_URL}/api/voting`);
  if (!res.ok) throw new Error("Failed to fetch votes");
  return res.json();
}

// Get votes for a specific category
export async function getVotesByCategory(category: string) {
  const res = await fetch(`${DERBY_API_URL}/api/voting/category/${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error("Failed to fetch votes for category");
  return res.json();
}

// Get a specific vote by ID
export async function getVoteById(id: string | number) {
  const res = await fetch(`${DERBY_API_URL}/api/voting/${id}`);
  if (!res.ok) throw new Error("Failed to fetch vote by ID");
  return res.json();
}

// Get voting results summary
export async function getVotingResults() {
  const res = await fetch(`${DERBY_API_URL}/api/voting/results`);
  if (!res.ok) throw new Error("Failed to fetch voting results");
  return res.json();
}
