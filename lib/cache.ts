import type { UserStats } from "@/types";

const TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const userCache = new Map<string, CacheEntry<{ userStats: UserStats }>>();
const graphCache = new Map<string, CacheEntry<{ graph: string }>>();

function getCached<T>(cache: Map<string, CacheEntry<T>>, key: string): T | null {
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expiresAt) {
    if (entry) cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached<T>(cache: Map<string, CacheEntry<T>>, key: string, data: T): void {
  cache.set(key, { data, expiresAt: Date.now() + TTL_MS });
}

export function getCachedUser(username: string): { userStats: UserStats } | null {
  return getCached(userCache, username.toLowerCase());
}

export function setCachedUser(username: string, data: { userStats: UserStats }): void {
  setCached(userCache, username.toLowerCase(), data);
}

export function getCachedGraph(username: string): { graph: string } | null {
  return getCached(graphCache, username.toLowerCase());
}

export function setCachedGraph(username: string, data: { graph: string }): void {
  setCached(graphCache, username.toLowerCase(), data);
}
