import { fetchPinewoodAPI } from "./api";
import type { VoteSubmission } from "@/types/VoteSubmission";

export enum VoteScoreField {
  CarId = "carId",
  CarName = "carName",
  TotalScore = "totalScore"
}

export type VoteScore = {
  [VoteScoreField.CarId]: number;
  [VoteScoreField.CarName]: string;
  [VoteScoreField.TotalScore]: number;
};

// Submit a vote for a car in a category, with voterIdentifier
export async function submitVote(vote: VoteSubmission) {
  const res = await fetchPinewoodAPI(`/api/voting`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vote),
  });
  if (!res.ok) throw new Error("Failed to submit vote");
  return res.json();
}
// Get all votes or votes by racerId
export async function getVotes(racerId?: string | number) {
  const endpoint = racerId
    ? `/api/voting/voter/${encodeURIComponent(racerId)}`
    : `/api/voting`;
  const res = await fetchPinewoodAPI(endpoint);
  if (!res.ok) throw new Error("Failed to fetch votes");
  return res.json();
}

// Get votes for a specific category
export async function getVoteByCategory(category: string) {
  const res = await fetchPinewoodAPI(`/api/voting/category/${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error("Failed to fetch votes for category");
  return res.json();
}

// Get vote scores for a specific category
export async function getVoteScoresByCategory(category: string): Promise<VoteScore[]> {
  const res = await fetchPinewoodAPI(`/api/voting/category/${encodeURIComponent(category)}/scores`);
  if (!res.ok) throw new Error("Failed to fetch vote scores for category");
  return res.json();
}

// Get a specific vote by ID
export async function getVoteById(id: string | number) {
  const res = await fetchPinewoodAPI(`/api/voting/${id}`);
  if (!res.ok) throw new Error("Failed to fetch vote by ID");
  return res.json();
}

// Get voting results summary
export async function getVotingResults() {
  const res = await fetchPinewoodAPI(`/api/voting/results`);
  if (!res.ok) throw new Error("Failed to fetch voting results");
  return res.json();
}
