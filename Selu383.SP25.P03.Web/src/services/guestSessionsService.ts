const GUEST_SESSION_KEY = "guest_session_id";

export interface GuestSession {
  sessionId: string;
  email?: string;
  reservationIds: number[];
  foodOrderIds: number[];
  createdAt: string;
}

export const createGuestSession = async (): Promise<string> => {
  try {
    const response = await fetch("/api/guest-sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create guest session");
    }

    const data = await response.json();
    const sessionId = data.sessionId || data.SessionId;

    localStorage.setItem(GUEST_SESSION_KEY, sessionId);

    return sessionId;
  } catch (error) {
    console.error("Error creating guest session:", error);
    throw error;
  }
};

export const getGuestSessionId = (): string | null => {
  return localStorage.getItem(GUEST_SESSION_KEY);
};

export const getGuestSessionData = async (sessionId: string): Promise<any> => {
  try {
    const response = await fetch(`/api/guest-sessions/${sessionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get guest session data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting guest session data:", error);
    throw error;
  }
};

export const addReservationToGuestSession = async (
  sessionId: string,
  reservationId: number
): Promise<void> => {
  try {
    const response = await fetch(
      `/api/guest-sessions/${sessionId}/reservations/${reservationId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add reservation to guest session");
    }
  } catch (error) {
    console.error("Error adding reservation to guest session:", error);
    throw error;
  }
};

export const addFoodOrderToGuestSession = async (
  sessionId: string,
  orderId: number
): Promise<void> => {
  try {
    const response = await fetch(
      `/api/guest-sessions/${sessionId}/food-orders/${orderId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add food order to guest session");
    }
  } catch (error) {
    console.error("Error adding food order to guest session:", error);
    throw error;
  }
};

export const migrateGuestSession = async (
  sessionId: string,
  username: string,
  password: string
): Promise<void> => {
  try {
    const response = await fetch(`/api/guest-sessions/${sessionId}/migrate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to migrate guest session");
    }

    localStorage.removeItem(GUEST_SESSION_KEY);
  } catch (error) {
    console.error("Error migrating guest session:", error);
    throw error;
  }
};

export const clearGuestSession = () => {
  localStorage.removeItem(GUEST_SESSION_KEY);
};
