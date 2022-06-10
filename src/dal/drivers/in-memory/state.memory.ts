import { InMemoryDAOGenerics } from './dao.memory.types'
import { MockIdSpecification } from './utils.memory'

type InMemoryState<T extends InMemoryDAOGenerics> = {
  idIndex: Map<T['idFields'] | string, number>
  emptyIndexes: number[]
  memory: ({ [key: string]: unknown } | null)[]
}
export const IN_MEMORY_STATE: Map<string, InMemoryState<InMemoryDAOGenerics>> = new Map()

export class InMemoryStateManager {
  private mockIdSpecification: MockIdSpecification<unknown> | undefined
  private daoName: string

  constructor(mockIdSpecification: MockIdSpecification<unknown> | undefined, daoName: string) {
    this.mockIdSpecification = mockIdSpecification
    this.daoName = daoName
  }

  public insertElement(id: unknown, e: { [key: string]: unknown }): void {
    const state = this.getState()
    const index = state.emptyIndexes.pop()
    if (index != null) {
      this.setIdIndex(id, index)
      state.memory[index] = e
    } else {
      const index = state.memory.length
      const sizeIncrement = state.memory.length > 512 ? 1024 : state.memory.length * 2
      state.emptyIndexes = this.allocMemory(sizeIncrement - 1)
        .map((v, i) => state.memory.length + 1 + i)
        .reverse()
      this.setIdIndex(id, index)
      state.memory[index] = e
    }
  }

  public updateElement(index: number, e: { [key: string]: unknown }): void {
    const state = this.getState()
    state.memory[index] = e
  }

  public deleteElement(id: unknown, index: number): void {
    const state = this.getState()
    state.memory[index] = null
    this.deleteIdIndex(id)
    state.emptyIndexes.push(index)
  }

  public getElement(index: number): { [key: string]: unknown } | null {
    const state = this.getState()
    return state.memory[index]
  }

  public *elements(): Iterable<{ index: number; record: { [key: string]: unknown } | null }> {
    const state = this.getState()
    for (let i = 0; i < state.memory.length; i++) {
      const record = state.memory[i]
      if (record !== null) {
        yield { index: i, record }
      }
    }
  }

  public getIdIndex(id: unknown): number | undefined {
    const state = this.getState()
    if (this.mockIdSpecification?.stringify) {
      return state.idIndex.get(this.mockIdSpecification?.stringify(id))
    }
    return state.idIndex.get(id)
  }

  public setIdIndex(id: unknown, index: number): void {
    const state = this.getState()
    if (this.mockIdSpecification?.stringify) {
      state.idIndex.set(this.mockIdSpecification?.stringify(id), index)
    } else {
      state.idIndex.set(id, index)
    }
  }

  public deleteIdIndex(id: unknown): void {
    const state = this.getState()
    if (this.mockIdSpecification?.stringify) {
      state.idIndex.delete(this.mockIdSpecification?.stringify(id))
    } else {
      state.idIndex.delete(id)
    }
  }

  private getState(): InMemoryState<InMemoryDAOGenerics> {
    const state = IN_MEMORY_STATE.get(this.daoName)
    if (state) {
      return state
    }
    IN_MEMORY_STATE.set(this.daoName, { memory: [], idIndex: new Map(), emptyIndexes: [0] })
    return this.getState()
  }

  private allocMemory(n: number): null[] {
    return Array(n).fill(null)
  }
}
