import { useCallback, useMemo, useState } from 'react'
import CustomizeModal from './components/CustomizeModal'
import Loader from './components/Loader'
import PizzaGrid from './components/PizzaGrid'
import useFetch from './hooks/useFetch'
import { fetchIngredients, fetchPizzas } from './api/client'
import { mapIngredients, mapPizza } from './utils/mapping'

const toArray = (payload) => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.pizzas)) return payload.pizzas
  if (Array.isArray(payload?.ingredients)) return payload.ingredients
  return []
}

const extractIngredients = (payload) => {
  if (!payload) return null
  if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return payload.data
  }
  return payload
}

function App() {
  const [selectedPizza, setSelectedPizza] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    data: rawPizzas,
    loading: loadingPizzas,
    error: pizzasError,
    refetch: refetchPizzas,
  } = useFetch(fetchPizzas)

  const {
    data: rawIngredients,
    loading: loadingIngredients,
    error: ingredientsError,
    refetch: refetchIngredients,
  } = useFetch(fetchIngredients)

  const pizzas = useMemo(
    () => toArray(rawPizzas).map((pizza) => mapPizza(pizza)),
    [rawPizzas],
  )

  const ingredients = useMemo(() => {
    const extracted = extractIngredients(rawIngredients)
    if (!extracted) return { crusts: [], specialBases: [], toppingsOne: [], toppingsTwo: [] }
    
    // Flatten the nested structure into a single array
    const allIngredients = []
    
    // Add crusts
    if (Array.isArray(extracted.crust)) {
      extracted.crust.forEach(item => {
        allIngredients.push({
          ...item,
          type: 'crust',
          name: item.crustName || item.name,
          id: item.crustCode || item.id,
        })
      })
    }
    
    // Add special bases
    if (Array.isArray(extracted.specialbases)) {
      extracted.specialbases.forEach(item => {
        allIngredients.push({
          ...item,
          type: 'base',
          name: item.specialbaseName || item.name,
          id: item.specialbaseCode || item.id,
        })
      })
    }
    
    // Add toppings
    if (extracted.toppings) {
      if (Array.isArray(extracted.toppings.countAsOne)) {
        extracted.toppings.countAsOne.forEach(item => {
          allIngredients.push({
            ...item,
            type: 'topping',
            name: item.toppingsName || item.name,
            id: item.toppingsName || item.id,
            count: parseInt(item.countAs || '1', 10),
          })
        })
      }
      if (Array.isArray(extracted.toppings.countAsTwo)) {
        extracted.toppings.countAsTwo.forEach(item => {
          allIngredients.push({
            ...item,
            type: 'topping',
            name: item.toppingsName || item.name,
            id: item.toppingsName || item.id,
            count: parseInt(item.countAs || '2', 10),
          })
        })
      }
    }
    
    return mapIngredients(allIngredients)
  }, [rawIngredients])

  const handleCustomize = useCallback((pizza) => {
    setSelectedPizza(pizza)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedPizza(null)
  }, [])

  const handleConfirm = useCallback((payload) => {
    console.info('Customized pizza confirmed', payload)
  }, [])

  return (
    <div className="min-h-screen bg-surface">
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-4 text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">
            Pizza Customizer
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Build the perfect pizza for every craving
          </h1>
          <p className="text-base text-slate-600 sm:max-w-2xl">
            Explore signature pizzas, tweak their sizes, swap crusts, layer special bases, and mix
            toppings. Watch the total update instantly and lock in your dream pie.
          </p>
        </header>

        {loadingPizzas && (
          <div className="rounded-2xl bg-white">
            <Loader label="Loading pizzas..." />
          </div>
        )}

        {pizzasError && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-600">
            <p className="text-sm font-medium">We couldn’t load pizzas right now.</p>
            <button
              type="button"
              onClick={refetchPizzas}
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loadingPizzas && !pizzasError && <PizzaGrid pizzas={pizzas} onCustomize={handleCustomize} />}
      </main>

      <CustomizeModal
        isOpen={isModalOpen}
        pizza={selectedPizza}
        ingredients={ingredients}
        loadingIngredients={loadingIngredients}
        ingredientsError={ingredientsError}
        onRetryIngredients={refetchIngredients}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
      />
    </div>
  )
}

export default App
