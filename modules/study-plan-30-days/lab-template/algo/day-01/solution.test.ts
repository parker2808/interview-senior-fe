import { describe, it, expect } from 'vitest'
import { twoSum } from './solution'

describe('day-01 twoSum', () => {
  it('example 1', () => {
    expect(twoSum([2, 7, 11, 15], 9).sort()).toEqual([0, 1])
  })
  it('example 2', () => {
    expect(twoSum([3, 2, 4], 6).sort()).toEqual([1, 2])
  })
})
