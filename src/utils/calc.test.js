// Tests for the calculation. Run with: npm test
import { describe, it, expect } from 'vitest'
import { impact } from './calc'

describe('impact', () => {
  it('calculates a price rise', () => {
    const r = impact(2, 100, 10)
    expect(r.current).toBe(200)
    expect(r.next).toBeCloseTo(220, 6) // toBeCloseTo avoids tiny decimal errors
    expect(r.diff).toBeCloseTo(20, 6)
  })
  it('calculates a price fall', () => expect(impact(1, 100, -25).next).toBeCloseTo(75, 6))
  it('gives zero change for 0%', () => expect(impact(3, 50, 0).diff).toBe(0))
})
