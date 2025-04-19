import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

// Simple encryption/decryption for more sensitive data
// Note: This is still not fully secure but better than plain AsyncStorage
// For production, use a proper secure storage solution like expo-secure-store

/**
 * Get a storage key with expiration
 */
export const getWithExpiry = async (key: string): Promise<any | null> => {
  try {
    const item = await AsyncStorage.getItem(key);
    if (!item) return null;

    const data = JSON.parse(item);

    // Check if the item has expired
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

/**
 * Set a storage key with expiration (in minutes)
 */
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

/**
 * Generate a secure hash for a string
 */
export const generateHash = async (text: string): Promise<string> => {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    text
  );
  return hash;
};

/**
 * Clean up old booking data
 */
export const cleanupExpiredStorage = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();

    // Get all items with potential expiry
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

        // Check if item has expiry field and has expired
        if (data.expiry && new Date().getTime() > data.expiry) {
          await AsyncStorage.removeItem(key);
        }
      } catch {
        // If not JSON or doesn't have expiry, just continue
        continue;
      }
    }
  } catch (error) {
    console.error("Error cleaning up expired storage:", error);
  }
};
