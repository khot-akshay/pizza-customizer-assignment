const parsePrice = (value) => {
  if (value == null) return 0
  const price = Number.parseFloat(
    typeof value === 'string' ? value.replace(/[^\d.]/g, '') : value,
  )
  return Number.isFinite(price) ? price : 0
}

const normalizeId = (item) =>
  item?.id ??
  item?._id ??
  item?.value ??
  item?.slug ??
  `temp-${(item?.name ?? item?.title ?? 'item').toString().replace(/\s+/g, '-').toLowerCase()}`

const normalizeName = (item) =>
  item?.name ??
  item?.pizza_name ??
  item?.title ??
  item?.label ??
  item?.displayName ??
  item?.value ??
  'Unknown'

const sizeOrder = ['personal', 'kids', 'small', 'medium', 'large', 'xl', 'xtra large', 'extra large']

const getSizeWeight = (label = '') => {
  const normalized = label.toString().toLowerCase()
  const index = sizeOrder.findIndex((entry) => normalized.includes(entry))
  return index === -1 ? Number.MAX_SAFE_INTEGER : index
}

const normalizeSizes = (pizza) => {
  const rawSizes =
    pizza?.sizes ??
    pizza?.pizza_prices ??
    pizza?.sizePrices ??
    pizza?.size_options ??
    pizza?.priceOptions ??
    pizza?.prices ??
    pizza?.variants ??
    []

  const entries = []

  if (Array.isArray(rawSizes)) {
    rawSizes.forEach((size) => {
      const label =
        size?.label ??
        size?.name ??
        size?.size ??
        size?.title ??
        size?.variant ??
        size?.key ??
        ''

      if (!label) return
      entries.push({
        label,
        price: parsePrice(size?.price ?? size?.value ?? size?.amount ?? size?.cost),
      })
    })
  } else if (rawSizes && typeof rawSizes === 'object') {
    Object.entries(rawSizes).forEach(([label, price]) => {
      if (!label) return
      entries.push({
        label,
        price: parsePrice(price),
      })
    })
  }

  return entries
    .filter((size) => size.label && Number.isFinite(size.price))
    .sort((a, b) => getSizeWeight(a.label) - getSizeWeight(b.label))
}

export const mapPizza = (pizza) => ({
  id: normalizeId(pizza),
  image:
    pizza?.image ??
    pizza?.pizza_image ??
    pizza?.imageUrl ??
    pizza?.image_url ??
    pizza?.thumbnail ??
    pizza?.photo ??
    '',
  name: normalizeName(pizza),
  category:
    (typeof pizza?.category === 'string'
      ? pizza.category
      : pizza?.category?.category_name ??
        pizza?.category?.name ??
        pizza?.category_name ??
        pizza?.categoryName ??
        pizza?.category?.title ??
        '') || 'Uncategorized',
  sizes: normalizeSizes(pizza),
})

const shouldBeCrust = (item) => {
  const text = `${item?.type ?? ''} ${item?.group ?? ''} ${item?.category ?? ''}`
  return text.toLowerCase().includes('crust')
}

const shouldBeBase = (item) => {
  const text = `${item?.type ?? ''} ${item?.group ?? ''} ${item?.category ?? ''}`
  return text.toLowerCase().includes('base')
}

const isDoubleTopping = (item, normalized) => {
  const text = `${item?.type ?? ''} ${item?.group ?? ''} ${item?.category ?? ''}`
  const lowered = text.toLowerCase()
  return (
    normalized.count >= 2 ||
    lowered.includes('double') ||
    lowered.includes('count as two') ||
    lowered.includes('two count')
  )
}

const getCount = (item) => {
  if (Number.isFinite(item?.count) && item.count > 0) return item.count
  if (Number.isFinite(item?.quantity) && item.quantity > 0) return item.quantity
  if (Number.isFinite(item?.multiplier) && item.multiplier > 0) return item.multiplier
  return 1
}

const normalizeIngredient = (item) => ({
  id: normalizeId(item),
  name: normalizeName(item),
  price: parsePrice(item?.price ?? item?.amount ?? item?.cost),
  count: getCount(item),
})

export const mapIngredients = (rawItems = []) => {
  const buckets = {
    crusts: [],
    specialBases: [],
    toppingsOne: [],
    toppingsTwo: [],
  }

  rawItems.forEach((item) => {
    const normalized = normalizeIngredient(item)
    if (!normalized.name) return

    if (shouldBeCrust(item)) {
      buckets.crusts.push(normalized)
      return
    }

    if (shouldBeBase(item)) {
      buckets.specialBases.push(normalized)
      return
    }

    if (isDoubleTopping(item, normalized)) {
      const multiplier = normalized.count >= 2 ? normalized.count : 2
      buckets.toppingsTwo.push({ ...normalized, count: multiplier })
    } else {
      buckets.toppingsOne.push({ ...normalized, count: normalized.count })
    }
  })

  const sortByName = (a, b) => a.name.localeCompare(b.name)

  buckets.crusts.sort(sortByName)
  buckets.specialBases.sort(sortByName)
  buckets.toppingsOne.sort(sortByName)
  buckets.toppingsTwo.sort(sortByName)

  return buckets
}


