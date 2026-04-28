import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

type StorageLike = {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
  removeItem: (name: string) => void | Promise<void>;
};

const noopStorage: StorageLike = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
};

const webStorage: StorageLike = {
  getItem: (name) => {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(name);
  },
};

export function getPersistStorage(): StorageLike {
  if (Platform.OS === 'web') return webStorage;
  return (AsyncStorage as unknown) as StorageLike;
}

export function getPersistStorageSSRSafe(): StorageLike {
  if (Platform.OS === 'web' && typeof window === 'undefined') return noopStorage;
  return getPersistStorage();
}

