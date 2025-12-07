import { fetchPinewoodAPI } from "./api";
import { fetchCarById } from "./cars";

/**
 * Fetches the results of the finalists for a given rank from the Pinewood API.
 *
 * @param rank - The rank identifier for which to fetch results.
 * @returns A promise that resolves to the results data for the specified rank.
 * @throws Will throw an error if the API request fails.
 */
export async function fetchAllResultsByRank(rank: string): Promise<any> {
	const res = await fetchPinewoodAPI(`/api/results/all-by-rank/${rank}`);
	if (!res.ok) throw new Error(`Failed to fetch results for rank ${rank}`);


		const results = await res.json();
		console.log(`fetchResultsByRank( ${rank} ) -> `, results);
		// Attach car and racer info to each result
		const enriched = await Promise.all(results.map(async (result: any) => {
			let car = null;

			if (result.carId) {
				car = await fetchCarById(String(result.carId));
			}
			return { ...result, car };
		}));

		console.log(`fetchResultsByRank( ${rank} ) enriched -> `, enriched);

		return enriched;
}


/**
 * Fetches the results of the non-finalists for a given rank from the Pinewood API.
 *
 * @param rank - The rank identifier for which to fetch results.
 * @returns A promise that resolves to the results data for the specified rank.
 * @throws Will throw an error if the API request fails.
 */
export async function fetchResultsByRank(rank: string): Promise<any> {
	const res = await fetchPinewoodAPI(`/api/results/final-by-rank/${rank}`);
	if (!res.ok) throw new Error(`Failed to fetch results for rank ${rank}`);


		const results = await res.json();
		console.log(`fetchResultsByRank( ${rank} ) -> `, results);
		// Attach car and racer info to each result
		const enriched = await Promise.all(results.map(async (result: any) => {
			let car = null;

			if (result.carId) {
				car = await fetchCarById(String(result.carId));
			}
			return { ...result, car };
		}));

		console.log(`fetchResultsByRank( ${rank} ) enriched -> `, enriched);

		return enriched;
}
