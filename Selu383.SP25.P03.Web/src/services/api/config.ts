// src/services/api/config.ts
import { API_BASE_URL } from "../../constants/BaseUrl";

/**
 * Helper function to handle fetch requests
 */
export async function fetchWithCredentials<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log("Making request to:", url);
    console.log("Request options:", {
      ...options,
      body: options.body ? "Body included" : "No body",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const response = await fetch(url, {
      ...options,
      credentials: "include", // Always include credentials for cookies
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      // Try to get more detailed error information
      const contentType = response.headers.get("content-type");
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;

      try {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.error("Error response data:", errorData);
          errorMessage = errorData.message || errorData.title || errorMessage;
        } else {
          const errorText = await response.text();
          console.error("Error response text:", errorText);
          if (errorText) {
            errorMessage = errorText;
          }
        }
      } catch (e) {
        console.error("Failed to parse error response:", e);
      }

      throw new Error(errorMessage);
    }

    // Handle empty responses (like for DELETE operations)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("Response data:", data);
      return data as T;
    }

    return {} as T;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}
