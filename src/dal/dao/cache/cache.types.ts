export interface TypettaCache {
  set(key: string, value: Buffer, ttlMs?: number): Promise<void>
  get(key: string): Promise<Buffer | null>
  stats(): Promise<{ hits: number; misses: number; sets: number; cached: number } | null>
}
