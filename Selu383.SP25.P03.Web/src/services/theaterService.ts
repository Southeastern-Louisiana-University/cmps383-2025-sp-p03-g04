import { Theater } from "../types/Theater";
import { API_BASE_URL, DEFAULT_HEADERS } from "../config/api";

export const getTheaters = async (): Promise<Theater[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/theaters`, {
      method: "GET",
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch theaters: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching theaters:", error);
    throw error;
  }
};

export const getTheater = async (id: number): Promise<Theater> => {
  try {
    const response = await fetch(`${API_BASE_URL}/theaters/${id}`, {
      method: "GET",
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch theater: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching theater with ID ${id}:`, error);
    throw error;
  }
};
