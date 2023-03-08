import { TypettaCache } from '../cache.types'
import _ from 'lodash'

export class MemoryTypettaCache implements TypettaCache {
  private readonly cache = new Map<string, { expiration?: number; value: Buffer; hits: number }>()
  private readonly byteLimit?: number
  private readonly hitMap = new Map<number, Set<string>>()
  private readonly expirationMap = new Map<number, Set<string>>()
  private currentBytes = 0
  private hits = 0
  private misses = 0
  private sets = 0
  private firstExpiresAt = Number.MAX_SAFE_INTEGER

  constructor(args?: { byteLimit?: number }) {
    if (args?.byteLimit && args.byteLimit <= 0) {
      throw new Error('Invalid byte limit')
    }
    this.byteLimit = args?.byteLimit
  }

  async set(key: string, value: Buffer, ttlMs?: number | undefined): Promise<void> {
    const now = new Date().getTime()
    this.currentBytes += value.length
    if (this.firstExpiresAt <= now) {
      this.firstExpiresAt = Number.MAX_SAFE_INTEGER
      const expired = [...this.expirationMap.entries()]
        .filter(([expireAt]) => {
          if (expireAt > now && expireAt < this.firstExpiresAt) {
            this.firstExpiresAt = expireAt
          }
          return expireAt <= now
        })
        .flatMap((v) => [...v[1].values()])
      for (const k of expired) {
        if (k === key) continue // in order to keep hits
        const o = this.deleteKey(k)
        if (o) {
          this.currentBytes -= o.value.length
        }
      }
    }
    while (this.byteLimit && this.currentBytes >= this.byteLimit) {
      const results = _.sortBy([...this.hitMap.entries()], ([hits]) => hits)
      if (results.length === 0) {
        break
      }
      for (const k of [...results[0][1].values()]) {
        const o = this.deleteKey(k)
        if (o) {
          this.currentBytes -= o.value.length
          if (this.currentBytes < this.byteLimit) {
            break
          }
        }
      }
    }
    this.sets++
    const expiration = ttlMs != null ? now + ttlMs : undefined
    if (expiration && expiration < this.firstExpiresAt) {
      this.firstExpiresAt = expiration
    }
    const old = this.deleteKey(key)
    this.setKey(key, { expiration, value, hits: old?.hits ?? 0 })
  }

  async get(key: string): Promise<Buffer | null> {
    const result = this.cache.get(key)
    if (result && (result.expiration == null || result.expiration > new Date().getTime())) {
      this.hits++
      this.deleteKey(key)
      this.setKey(key, { ...result, hits: result.hits + 1 })
      return result.value
    }
    this.misses++
    return null
  }

  async stats(): Promise<{ hits: number; misses: number; sets: number; cached: number }> {
    return { hits: this.hits, misses: this.misses, sets: this.sets, cached: this.cache.size }
  }

  private deleteKey(key: string): { expiration?: number; value: Buffer; hits: number } | null {
    const result = this.cache.get(key)
    if (!result) {
      return null
    }
    this.cache.delete(key)

    //hits
    const hitSet = this.hitMap.get(result.hits)
    if (hitSet) {
      hitSet.delete(key)
      if (hitSet.size === 0) {
        this.hitMap.delete(result.hits)
      }
    }

    //expirations
    if (result.expiration != null) {
      const expirationSet = this.expirationMap.get(result.expiration)
      if (expirationSet) {
        expirationSet.delete(key)
        if (expirationSet.size === 0) {
          this.expirationMap.delete(result.expiration)
        }
      }
    }

    return result
  }

  private setKey(key: string, value: { expiration?: number; value: Buffer; hits: number }): void {
    this.cache.set(key, value)

    //hits
    const hitSet = this.hitMap.get(value.hits)
    if (hitSet) {
      hitSet.add(key)
    } else {
      this.hitMap.set(value.hits, new Set([key]))
    }

    //expirations
    if (value.expiration != null) {
      const expirationSet = this.expirationMap.get(value.expiration)
      if (expirationSet) {
        expirationSet.add(key)
      } else {
        this.expirationMap.set(value.expiration, new Set([key]))
      }
    }
  }
}
