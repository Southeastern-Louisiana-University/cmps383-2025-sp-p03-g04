import AsyncStorage from "@react-native-async-storage/async-storage";

export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage cleared successfully");
  } catch (error) {
    console.error("Failed to clear AsyncStorage:", error);
  }
};

/**
 * Clears only authentication-related data from AsyncStorage
 */
export const clearAuthStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(["userId", "username", "userRole"]);
    console.log("Auth storage cleared successfully");
  } catch (error) {
    console.error("Failed to clear auth storage:", error);
  }
};

/**
 * Logs all current AsyncStorage keys for debugging
 */
export const logStorageKeys = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log("Current AsyncStorage keys:", keys);

    // Log values for each key
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      console.log(`${key}: ${value}`);
    }
  } catch (error) {
    console.error("Failed to log storage keys:", error);
  }
};
