export class MappedIterable<T, O> implements AsyncIterable<O> {
  private map: (t: T) => O
  private iterable: AsyncIterable<T>
  constructor(iterable: AsyncIterable<T>, map: (t: T) => O) {
    this.map = map
    this.iterable = iterable
  }
  [Symbol.asyncIterator](): AsyncIterator<O> {
    const iterator = this.iterable[Symbol.asyncIterator]()
    return {
      next: async () => {
        const result = await iterator.next()
        return { value: this.map(result.value), done: false }
      },
      return: async (value) => {
        if (iterator.return) {
          const result = await iterator.return(value)
          return { value: this.map(result.value), done: false }
        }
        return { value: undefined, done: true }
      },
      throw: async (e) => {
        if (iterator.throw) {
          const result = await iterator.throw(e)
          return { value: this.map(result.value), done: false }
        }
        return { value: undefined, done: true }
      },
    }
  }
}
