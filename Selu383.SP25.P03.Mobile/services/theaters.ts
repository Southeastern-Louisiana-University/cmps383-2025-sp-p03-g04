import * as api from "./api";
import { Theater } from "@/components/TheaterSelector";

/**
 * Fetches all theaters from the API
 * @returns A promise that resolves to an array of theaters
 */
export async function getTheaters(): Promise<Theater[]> {
  return api.getTheaters();
}

/**
 * Fetches a specific theater by ID
 * @param id The ID of the theater to fetch
 * @returns A promise that resolves to the theater
 */
export async function getTheater(id: number): Promise<Theater> {
  return api.getTheater(id);
}
