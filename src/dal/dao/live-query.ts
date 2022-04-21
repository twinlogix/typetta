import { LiveQuery } from './dao.types'
import crypto from 'crypto'

export class LiveQueryImpl<T> extends LiveQuery<T> {
  private id = 0
  private intervalId: NodeJS.Timeout
  private listeners: Map<number, (value: IteratorResult<T> | { error: Error }) => void>
  private listenersState: Map<number, string>
  private error: Error | undefined = undefined
  private running = true
  private refresh: () => Promise<T>
  constructor(refresh: () => Promise<T>, pollingRateMs?: number) {
    super()
    this.listeners = new Map()
    this.listenersState = new Map()
    this.refresh = refresh
    this.intervalId = setInterval(() => this.tick(), pollingRateMs ?? 1000)
    this.tick()
  }

  private tick() {
    console.log(new Date, "TICK", this.running, this.error)
    this.refresh().then(
      (state) => {
        const hash = crypto.createHash('sha256').update(JSON.stringify(state)).digest('base64')
        for (const [id, listener] of this.listeners.entries()) {
          const lastHash = this.listenersState.get(id)
          if (lastHash === hash) {
            continue
          }
          this.listenersState.set(id, hash)
          listener({ value: state, done: false })
        }
      },
      (error) => {
        this.error = error
        this.running = false
        clearInterval(this.intervalId)
        for (const listener of this.listeners.values()) {
          listener({ error })
        }
      },
    )
  }

  public async close() {
    this.running = false
    clearInterval(this.intervalId)
    for (const listener of this.listeners.values()) {
      listener({ value: undefined, done: true })
    }
  }

  public asyncIterator(): AsyncIterator<T> {
    const id = this.id++
    console.log(new Date, "NEW ITERATOR", this.running, this.error)
    return {
      next: async () => {
        console.log(new Date, "NEXT", this.running, this.error)
        if (!this.running) {
          throw new Error("Iterator is closed")
          //return { value: undefined, done: true }
        }
        if (this.error !== undefined) {
          throw this.error
        }
        return new Promise<IteratorResult<T> | { error: Error }>((resolve) => this.listeners.set(id, resolve)).then((v) => {
          if ('error' in v) {
            throw v.error
          } else {
            return v
          }
        })
      },
      return: async () => {
        console.log(new Date, "RETURN", this.running, this.error)
        const listener = this.listeners.get(id)
        if (listener) {
          listener({ value: undefined, done: true })
        }
        this.listeners.delete(id)
        if (this.listeners.size === 0) {
          this.running = false
          clearInterval(this.intervalId)
        }
        return { value: undefined, done: true }
      },
      throw: async () => {
        console.log(new Date, "THROW", this.running, this.error)
        const listener = this.listeners.get(id)
        if (listener) {
          listener({ value: undefined, done: true })
        }
        this.listeners.delete(id)
        if (this.listeners.size === 0) {
          this.running = false
          clearInterval(this.intervalId)
        }
        return { value: undefined, done: true }
      },
    }
  }
}
