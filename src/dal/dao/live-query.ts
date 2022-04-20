import { LiveQuery } from './dao.types'

export class LiveQueryImpl<T> extends LiveQuery<T> {
  private id = 0
  private intervalId: NodeJS.Timeout
  private listeners: Map<number, (value: IteratorResult<T> | { error: Error }) => void>
  constructor(refresh: () => Promise<T>, pollingRateMs?: number) {
    super()
    this.listeners = new Map()
    this.intervalId = setInterval(() => {
      refresh().then(
        (state) => {
          for (const listener of this.listeners.values()) {
            listener({ value: state, done: false })
          }
        },
        (error) => {
          for (const listener of this.listeners.values()) {
            listener({ error })
          }
          clearInterval(this.intervalId)
        },
      )
    }, pollingRateMs ?? 1000)
  }
  public async close() {
    clearInterval(this.intervalId)
    for (const listener of this.listeners.values()) {
      listener({ value: undefined, done: true })
    }
  }
  public asyncIterator(): AsyncIterator<T> {
    const id = this.id++
    return {
      next: () =>
        new Promise<IteratorResult<T> | { error: Error }>((resolve) => this.listeners.set(id, resolve)).then((v) => {
          if ('error' in v) {
            throw v.error
          } else {
            return v
          }
        }),
      return: async () => {
        const listener = this.listeners.get(id)
        if (listener) {
          listener({ value: undefined, done: true })
        }
        this.listeners.delete(id)
        if (this.listeners.size === 0) {
          clearInterval(this.intervalId)
        }
        return { value: undefined, done: true }
      },
      throw: async () => {
        const listener = this.listeners.get(id)
        if (listener) {
          listener({ value: undefined, done: true })
        }
        this.listeners.delete(id)
        if (this.listeners.size === 0) {
          clearInterval(this.intervalId)
        }
        return { value: undefined, done: true }
      },
    }
  }
}
