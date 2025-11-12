import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import Loader from './Loader'
import { calcTotal, formatCurrency } from '../utils/price'

const checkboxClasses =
  'flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-brand focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/40'

const CustomizeModal = ({
  isOpen,
  pizza,
  ingredients,
  loadingIngredients = false,
  ingredientsError = null,
  onRetryIngredients,
  onClose,
  onConfirm,
}) => {
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedCrustId, setSelectedCrustId] = useState('')
  const [selectedBaseId, setSelectedBaseId] = useState('')
  const [selectedToppingsOne, setSelectedToppingsOne] = useState([])
  const [selectedToppingsTwo, setSelectedToppingsTwo] = useState([])

  useEffect(() => {
    if (isOpen && pizza) {
      setSelectedSize(pizza?.sizes?.[0]?.label ?? '')
      setSelectedCrustId('')
      setSelectedBaseId('')
      setSelectedToppingsOne([])
      setSelectedToppingsTwo([])
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, pizza])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const sizeOptions = pizza?.sizes ?? []
  const selectedSizeOption = useMemo(
    () => sizeOptions.find((size) => size.label === selectedSize) ?? sizeOptions[0],
    [sizeOptions, selectedSize],
  )

  const crusts = ingredients?.crusts ?? []
  const specialBases = ingredients?.specialBases ?? []
  const toppingsOne = ingredients?.toppingsOne ?? []
  const toppingsTwo = ingredients?.toppingsTwo ?? []

  const selectedCrust = useMemo(
    () => crusts.find((item) => item.id === selectedCrustId) ?? null,
    [crusts, selectedCrustId],
  )
  const selectedBase = useMemo(
    () => specialBases.find((item) => item.id === selectedBaseId) ?? null,
    [selectedBaseId, specialBases],
  )
  const selectedToppingsOneItems = useMemo(
    () => toppingsOne.filter((item) => selectedToppingsOne.includes(item.id)),
    [selectedToppingsOne, toppingsOne],
  )
  const selectedToppingsTwoItems = useMemo(
    () => toppingsTwo.filter((item) => selectedToppingsTwo.includes(item.id)),
    [selectedToppingsTwo, toppingsTwo],
  )

  const totalPrice = useMemo(
    () =>
      calcTotal({
        basePrice: selectedSizeOption?.price ?? 0,
        crust: selectedCrust,
        specialBase: selectedBase,
        toppingsOne: selectedToppingsOneItems,
        toppingsTwo: selectedToppingsTwoItems,
      }),
    [selectedBase, selectedCrust, selectedSizeOption, selectedToppingsOneItems, selectedToppingsTwoItems],
  )

  if (!isOpen || !pizza) {
    return null
  }

  const toggleSelection = (id, setList) => {
    setList((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id],
    )
  }

  const handleConfirm = () => {
    const payload = {
      pizza: pizza.name,
      size: selectedSizeOption?.label ?? '',
      crust: selectedCrust?.name ?? null,
      specialBase: selectedBase?.name ?? null,
      toppings: [...selectedToppingsOneItems, ...selectedToppingsTwoItems].map(
        (item) => item.name,
      ),
      totalPrice,
    }

    console.log(JSON.stringify(payload, null, 2))
    onConfirm?.(payload)
    onClose?.()
  }

  const body = (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close customization modal"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="customize-heading"
        className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl focus:outline-none"
      >
        <header className="sticky top-0 z-10 flex flex-col gap-2 border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">Customize</p>
          <h2 id="customize-heading" className="text-2xl font-semibold text-slate-900">
            {pizza.name}
          </h2>
          <p className="text-sm font-medium text-slate-500">{pizza.category}</p>
        </header>

        <div className="flex-1 space-y-8 px-6 py-6">
          <section>
            <label htmlFor="size" className="mb-3 block text-sm font-semibold text-slate-700">
              Size
            </label>
            {sizeOptions.length ? (
              <select
                id="size"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:cursor-not-allowed disabled:bg-slate-100"
                value={selectedSizeOption?.label ?? ''}
                onChange={(event) => setSelectedSize(event.target.value)}
                disabled={!sizeOptions.length}
              >
                {sizeOptions.map((size) => (
                  <option key={`${pizza.id}-${size.label}`} value={size.label}>
                    {size.label} — {formatCurrency(size.price)}
                  </option>
                ))}
              </select>
            ) : (
              <p className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                This pizza does not have size pricing yet. Please choose another pizza.
              </p>
            )}
          </section>

          <section className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">Crust</label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              value={selectedCrustId}
              onChange={(event) => setSelectedCrustId(event.target.value)}
            >
              <option value="">Default (no extra cost)</option>
              {crusts.map((crust) => (
                <option key={crust.id} value={crust.id}>
                  {crust.name} {crust.price ? `— ${formatCurrency(crust.price)}` : ''}
                </option>
              ))}
            </select>
          </section>

          <section className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">Special Base</label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              value={selectedBaseId}
              onChange={(event) => setSelectedBaseId(event.target.value)}
            >
              <option value="">None</option>
              {specialBases.map((base) => (
                <option key={base.id} value={base.id}>
                  {base.name} {base.price ? `— ${formatCurrency(base.price)}` : ''}
                </option>
              ))}
            </select>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">Toppings — Count as One</h3>
              <span className="text-xs font-medium text-slate-500">
                {selectedToppingsOne.length} selected
              </span>
            </div>
            <div className="grid gap-3">
              {loadingIngredients ? (
                <Loader label="Loading toppings..." />
              ) : ingredientsError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  Failed to load toppings.{' '}
                  <button
                    type="button"
                    onClick={onRetryIngredients}
                    className="font-semibold text-red-700 underline underline-offset-2 transition hover:text-red-800"
                  >
                    Try again
                  </button>
                </div>
              ) : toppingsOne.length ? (
                toppingsOne.map((topping) => (
                  <label key={topping.id} className={checkboxClasses}>
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                      checked={selectedToppingsOne.includes(topping.id)}
                      onChange={() =>
                        toggleSelection(topping.id, setSelectedToppingsOne)
                      }
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{topping.name}</p>
                      <p className="text-xs font-medium text-slate-500">
                        {formatCurrency(topping.price)}
                      </p>
                    </div>
                  </label>
                ))
              ) : (
                <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  No toppings available.
                </p>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">Toppings — Count as Two</h3>
              <span className="text-xs font-medium text-slate-500">
                {selectedToppingsTwo.length} selected
              </span>
            </div>
            <div className="grid gap-3">
              {loadingIngredients ? (
                <Loader label="Loading toppings..." />
              ) : ingredientsError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  Failed to load toppings.{' '}
                  <button
                    type="button"
                    onClick={onRetryIngredients}
                    className="font-semibold text-red-700 underline underline-offset-2 transition hover:text-red-800"
                  >
                    Try again
                  </button>
                </div>
              ) : toppingsTwo.length ? (
                toppingsTwo.map((topping) => (
                  <label key={topping.id} className={checkboxClasses}>
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                      checked={selectedToppingsTwo.includes(topping.id)}
                      onChange={() =>
                        toggleSelection(topping.id, setSelectedToppingsTwo)
                      }
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{topping.name}</p>
                      <p className="text-xs font-medium text-slate-500">
                        {formatCurrency(topping.price)} ×{' '}
                        {Number.isFinite(topping.count) && topping.count > 0 ? topping.count : 2}
                      </p>
                    </div>
                  </label>
                ))
              ) : (
                <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  No premium toppings available.
                </p>
              )}
            </div>
          </section>
        </div>

        <footer className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Total</p>
            <p className="text-2xl font-semibold text-slate-900">{formatCurrency(totalPrice)}</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedSizeOption}
              onClick={handleConfirm}
              className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Confirm Selection
            </button>
          </div>
        </footer>
      </aside>
    </div>
  )

  return createPortal(body, document.body)
}

export default CustomizeModal


