import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

interface CachedData<T> {
  timestamp: number;
  data: T;
}

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;

    const parsed: CachedData<T> = JSON.parse(cached);
    if (Date.now() - parsed.timestamp > CACHE_TTL) {
      await AsyncStorage.removeItem(key); 
      return null;
    }
    return parsed.data;
  } catch (err) {
    console.warn('Cache error:', err);
    await AsyncStorage.removeItem(key); 
    return null;
  }
};

export const setCachedData = async <T>(key: string, data: T): Promise<void> => {
  const payload: CachedData<T> = { timestamp: Date.now(), data };
  try {
    await AsyncStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to save cache:', err);
  }
};
