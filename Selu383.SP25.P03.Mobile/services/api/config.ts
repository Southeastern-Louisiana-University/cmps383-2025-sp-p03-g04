import { BASE_URL } from '../../constants/BaseUrl';

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
      credentials: 'include', // Always include credentials for cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    // Handle empty responses (like for DELETE operations)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json() as T;
    }
    
    return {} as T;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}