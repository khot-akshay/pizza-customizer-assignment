import PizzaCard from './PizzaCard'

const PizzaGrid = ({ pizzas = [], onCustomize }) => {
  if (!pizzas.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-600">
        No pizzas available right now. Please try again later.
      </div>
    )
  }

  return (
    <section
      aria-label="Pizza selection"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {pizzas.map((pizza) => (
        <PizzaCard key={pizza.id} pizza={pizza} onCustomize={onCustomize} />
      ))}
    </section>
  )
}

export default PizzaGrid


