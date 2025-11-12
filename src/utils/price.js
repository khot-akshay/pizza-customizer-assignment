const toNumber = (value) => {
  if (!value) return 0
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.replace(/[^\d.]/g, ''))
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

export const calcTotal = ({
  basePrice = 0,
  crust,
  specialBase,
  toppingsOne = [],
  toppingsTwo = [],
}) => {
  const base = toNumber(basePrice)
  const crustPrice = toNumber(crust?.price)
  const specialBasePrice = toNumber(specialBase?.price)

  const toppingsOneTotal = toppingsOne.reduce((total, topping) => {
    const price = toNumber(topping?.price)
    return total + price
  }, 0)

  const toppingsTwoTotal = toppingsTwo.reduce((total, topping) => {
    const price = toNumber(topping?.price)
    const count = Number.isFinite(topping?.count) && topping.count > 0 ? topping.count : 2
    return total + price * count
  }, 0)

  const total = base + crustPrice + specialBasePrice + toppingsOneTotal + toppingsTwoTotal

  return Number(total.toFixed(2))
}

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(toNumber(value))

export default calcTotal


