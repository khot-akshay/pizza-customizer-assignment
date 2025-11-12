import { formatCurrency } from '../utils/price'

const PizzaCard = ({ pizza, onCustomize }) => {
  const { image, name, category, sizes } = pizza

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-xl focus-within:-translate-y-1 focus-within:shadow-xl">
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 text-sm font-medium text-slate-500">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">{category}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{name}</h3>
        </div>

        {sizes?.length ? (
          <ul className="grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2">
            {sizes.map((size) => (
              <li
                key={`${pizza.id}-${size.label}`}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
              >
                <span className="font-medium text-slate-700">{size.label}</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(size.price)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500">
            Pricing unavailable
          </p>
        )}

        <button
          type="button"
          onClick={() => onCustomize?.(pizza)}
          className="mt-auto inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
        >
          Customize
        </button>
      </div>
    </article>
  )
}

export default PizzaCard


