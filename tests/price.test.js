import { describe, expect, it } from 'vitest'
import { calcTotal } from '../src/utils/price.js'

describe('calcTotal', () => {
  it('returns the base price when no add-ons are selected', () => {
    expect(
      calcTotal({
        basePrice: 299,
      }),
    ).toBe(299)
  })

  it('adds crust and special base prices when selected', () => {
    expect(
      calcTotal({
        basePrice: 199,
        crust: { price: 40 },
        specialBase: { price: 30 },
      }),
    ).toBe(269)
  })

  it('adds single-count toppings individually', () => {
    expect(
      calcTotal({
        basePrice: 350,
        toppingsOne: [{ price: 25 }, { price: 15 }],
      }),
    ).toBe(390)
  })

  it('multiplies double-count toppings by their count', () => {
    expect(
      calcTotal({
        basePrice: 400,
        toppingsTwo: [
          { price: 30, count: 2 },
          { price: 50, count: 3 },
        ],
      }),
    ).toBe(610)
  })

  it('defaults the multiplier for double-count toppings to 2 when missing', () => {
    expect(
      calcTotal({
        basePrice: 250,
        toppingsTwo: [{ price: 40 }, { price: 20, count: 0 }],
      }),
    ).toBe(370)
  })

  it('handles prices delivered as strings', () => {
    expect(
      calcTotal({
        basePrice: '199',
        crust: { price: '40' },
        toppingsOne: [{ price: '20' }],
        toppingsTwo: [{ price: '30', count: 2 }],
      }),
    ).toBe(319)
  })

  it('rounds to two decimals', () => {
    expect(
      calcTotal({
        basePrice: 199.345,
        toppingsOne: [{ price: 0.335 }],
      }),
    ).toBe(199.68)
  })
})


