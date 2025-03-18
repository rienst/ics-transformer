import { describe, expect, it } from 'vitest'
import { transform, transformMany } from '.'

describe('transform', () => {
  it('exists', () => {
    expect(transform).toBeDefined()
  })

  it('applies the transformer to the input', () => {
    const input = 1
    const transformer = (x: number) => x + 1
    const result = transform(input, transformer)
    expect(result).toBe(2)
  })

  it('applies multiple transformers in sequence', () => {
    const input = 1
    const transformer1 = (x: number) => x + 1
    const transformer2 = (x: number) => x * 2
    const result = transform(input, [transformer1, transformer2])
    expect(result).toBe(4)
  })
})

describe('transformMany', () => {
  it('exists', () => {
    expect(transformMany).toBeDefined()
  })

  it('applies the transformer to the input', () => {
    const input = [1, 2]
    const transformer = (x: number) => x + 1
    const result = transformMany(input, transformer)
    expect(result).toEqual([2, 3])
  })

  it('applies multiple transformers in sequence', () => {
    const input = [1, 2]
    const transformer1 = (x: number) => x + 1
    const transformer2 = (x: number) => x * 2
    const result = transformMany(input, [transformer1, transformer2])
    expect(result).toEqual([4, 6])
  })
})
