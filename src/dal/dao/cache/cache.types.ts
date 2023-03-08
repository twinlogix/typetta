export interface TypettaCache {
  set(dao: string, group: string, key: string, value: Buffer, ttlMs?: number): Promise<void>
  get(dao: string, group: string, key: string): Promise<Buffer | null>
  delete(dao: string, groups: string[]): Promise<void>
  stats(): Promise<{ hits: number; misses: number; sets: number; cached: number } | null>
}
