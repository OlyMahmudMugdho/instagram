import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';
const KEY_REGEX = /[^A-Za-z0-9._-]/g;

function normalizeKey(key: string) {
  const normalized = String(key || '').replace(KEY_REGEX, '_');
  if (!normalized) {
    throw new Error('Storage key is empty after normalization');
  }
  return normalized;
}

export const storage = {
  setItem: async (key: string, value: string) => {
    const safeKey = normalizeKey(key);
    if (isWeb) {
      localStorage.setItem(safeKey, value);
    } else {
      await SecureStore.setItemAsync(safeKey, value);
    }
  },
  getItem: async (key: string) => {
    const safeKey = normalizeKey(key);
    if (isWeb) {
      return localStorage.getItem(safeKey);
    } else {
      return await SecureStore.getItemAsync(safeKey);
    }
  },
  deleteItem: async (key: string) => {
    const safeKey = normalizeKey(key);
    if (isWeb) {
      localStorage.removeItem(safeKey);
    } else {
      await SecureStore.deleteItemAsync(safeKey);
    }
  }
};
