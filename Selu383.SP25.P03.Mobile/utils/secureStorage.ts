import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

export const getWithExpiry = async (key: string): Promise<any | null> => {
  try {
    const item = await AsyncStorage.getItem(key);
    if (!item) return null;

    const data = JSON.parse(item);

    if (data.expiry && new Date().getTime() > data.expiry) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return data.value;
  } catch (error) {
    console.error(`Error getting ${key} from storage:`, error);
    return null;
  }
};

export const setWithExpiry = async (
  key: string,
  value: any,
  expiryMinutes: number = 30
): Promise<void> => {
  try {
    const item = {
      value,
      expiry: new Date().getTime() + expiryMinutes * 60 * 1000,
    };

    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error(`Error setting ${key} in storage:`, error);
  }
};

export const generateHash = async (text: string): Promise<string> => {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    text
  );
  return hash;
};

export const cleanupExpiredGuestTickets = async (): Promise<void> => {
  try {
    const guestTicketsStr = await AsyncStorage.getItem("guestTickets");
    if (!guestTicketsStr) return;

    const guestTickets = JSON.parse(guestTicketsStr);
    const now = new Date().getTime();

    const validTickets = guestTickets.filter((ticket: any) => {
      if (!ticket.expiresAt) return false;

      const expiryTime = new Date(ticket.expiresAt).getTime();
      return expiryTime > now;
    });

    if (validTickets.length > 0) {
      await AsyncStorage.setItem("guestTickets", JSON.stringify(validTickets));
    } else {
      await AsyncStorage.removeItem("guestTickets");
    }
  } catch (error) {
    console.error("Failed to clean up expired guest tickets:", error);
  }
};

export const cleanupExpiredStorage = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();

    const expiryKeys = keys.filter(
      (key) =>
        key.includes("booking") ||
        key.includes("guestTickets") ||
        key.includes("foodCart")
    );

    for (const key of expiryKeys) {
      const item = await AsyncStorage.getItem(key);
      if (!item) continue;

      try {
        const data = JSON.parse(item);

        if (data.expiry && new Date().getTime() > data.expiry) {
          await AsyncStorage.removeItem(key);
        }
      } catch {
        continue;
      }
    }
  } catch (error) {
    console.error("Error cleaning up expired storage:", error);
  }
};
