import { fetchPinewoodAPI } from "./api";
import { fetchCarById, Car } from "./cars";
import { RankType } from "./racers";

export interface ResultItem {
	carId: number | string;
	racerId?: number | string;
	place?: number;
	car?: Car | null;
}

/**
 * Fetches the results of the finalists for a given rank from the Pinewood API.
 *
 * @param rank - The rank identifier for which to fetch results.
 * @returns A promise that resolves to the results data for the specified rank.
 * @throws Will throw an error if the API request fails.
 */
export async function fetchAllResultsByRank(rank: RankType): Promise<ResultItem[]> {
	const res = await fetchPinewoodAPI(`/api/results?include=${rank}`);
	if (!res.ok) throw new Error(`Failed to fetch results for rank ${rank}`);


		const results: Array<Partial<ResultItem>> = await res.json();
		// Attach car and racer info to each result
		const enriched = await Promise.all(results.map(async (result) => {
			let car = null;

			if (result.carId) {
				car = await fetchCarById(String(result.carId));
			}
			return { ...result, car } as ResultItem;
		}));


		return enriched;
}


/**
 * Fetches the results of the non-finalists for a given rank from the Pinewood API.
 *
 * @param rank - The rank identifier for which to fetch results.
 * @returns A promise that resolves to the results data for the specified rank.
 * @throws Will throw an error if the API request fails.
 */
export async function fetchResultsByRank(rank: RankType): Promise<ResultItem[]> {
	const res = await fetchPinewoodAPI(`/api/results?include=${rank}`);
	if (!res.ok) throw new Error(`Failed to fetch results for rank ${rank}`);


		const results: Array<Partial<ResultItem>> = await res.json();

		// Attach car and racer info to each result
		const enriched = await Promise.all(results.map(async (result) => {
			let car = null;

			if (result.carId) {
				car = await fetchCarById(String(result.carId));
			}
			return { ...result, car } as ResultItem;
		}));

		return enriched;
}
