import { TypettaCache } from '../cache.types'
import { RedisClientType } from 'redis'

export class RedisTypettaCache implements TypettaCache {
  private client: RedisClientType
  private keyPrefix: string
  private hits = 0
  private sets = 0
  private misees = 0
  private onError: (error: unknown) => Promise<void>
  constructor(args: { client: RedisClientType; keyPrefix?: string; onError?: (error: unknown) => Promise<void> }) {
    this.client = args.client
    this.keyPrefix = args.keyPrefix ?? ''
    this.onError = args.onError ?? (() => Promise.resolve())
  }
  async set(dao: string, group: string, key: string, value: Buffer, ttlMs?: number | undefined): Promise<void> {
    try {
      const result = await this.client.set(`${this.keyPrefix}${dao}:${group}:${key}`, value, { PX: ttlMs })
      console.log(result)
      this.sets++
    } catch (error) {
      await this.onError(error)
    }
  }
  async get(dao: string, group: string, key: string): Promise<Buffer | null> {
    try {
      const result = await this.client.get(this.client.commandOptions({ returnBuffers: true }), `${this.keyPrefix}${dao}:${group}:${key}`)
      if (result) {
        this.hits++
      } else {
        this.misees++
      }
      return result
    } catch (error) {
      await this.onError(error)
      return null
    }
  }
  async delete(dao: string, groups?: string[] | undefined): Promise<void> {
    const toFind = groups ? groups.map((g) => `${this.keyPrefix}${dao}:${g}:*`) : [`${this.keyPrefix}${dao}:*`]
    const keys: string[] = []
    try {
      for (const k of toFind) {
        for await (const key of this.client.scanIterator({ MATCH: k })) {
          keys.push(key)
          if (keys.length >= 1024) {
            await this.client.unlink(keys)
            keys.length = 0
          }
        }
      }
      if (keys.length > 0) {
        await this.client.unlink(keys)
      }
    } catch (error) {
      await this.onError(error)
    }
  }
  async stats(): Promise<{ hits: number; misses: number; sets: number; cached: number } | null> {
    let cached = 0
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (const _ of this.client.scanIterator({ MATCH: `${this.keyPrefix}*` })) {
        cached++
      }
    } catch (error) {
      await this.onError(error)
    }
    return { hits: this.hits, misses: this.misees, sets: this.sets, cached }
  }
}
