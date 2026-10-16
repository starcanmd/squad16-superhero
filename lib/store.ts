import "server-only";
import { Redis } from "@upstash/redis";

// Shared storage for Team Assessment submissions and per-person checklists.
// On Vercel, add Upstash Redis from the Storage tab. It sets the env vars below automatically.
// Without them, a process-local memory store is used. That works for local dev and previews,
// but on Vercel the memory does not survive between requests, so submissions would be lost.

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const storeConfigured = Boolean(url && token);

const redis = storeConfigured ? new Redis({ url: url!, token: token! }) : null;
const mem = new Map<string, unknown>();

const NS = "squad16:";

export async function getJSON<T>(key: string): Promise<T | null> {
  if (redis) return (await redis.get<T>(NS + key)) ?? null;
  return (mem.get(NS + key) as T) ?? null;
}

export async function setJSON<T>(key: string, value: T): Promise<void> {
  if (redis) {
    await redis.set(NS + key, value);
    return;
  }
  mem.set(NS + key, value);
}

export async function getMany<T>(keys: string[]): Promise<(T | null)[]> {
  if (keys.length === 0) return [];
  if (redis) return (await redis.mget<T[]>(...keys.map((k) => NS + k))) as (T | null)[];
  return keys.map((k) => (mem.get(NS + k) as T) ?? null);
}
