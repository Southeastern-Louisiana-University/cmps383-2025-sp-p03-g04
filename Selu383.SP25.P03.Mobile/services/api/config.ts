import { BASE_URL } from "../../constants/BaseUrl";

/**
 * Helper function to handle fetch requests
 */
export async function fetchWithCredentials<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    // Handle different types of errors
    if (!response.ok) {
      // Handle different status codes
      if (response.status === 401) {
        throw new Error("Authentication required. Please log in.");
      } else if (response.status === 403) {
        throw new Error("You do not have permission to access this resource.");
      } else if (response.status === 404) {
        throw new Error("The requested resource was not found.");
      } else {
        // Try to get error details from response
        try {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `API error: ${response.status} ${response.statusText}`
          );
        } catch (e) {
          throw new Error(
            `API request failed: ${response.status} ${response.statusText}`
          );
        }
      }
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    return {} as T;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}
