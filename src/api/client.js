const PIZZA_URL =
  'https://pizzaadmin.neosao.co.in/api/v1/mas/vx/pizzas?sign_key=akjsh3h28jais1poqpamvg1'
const INGREDIENT_URL =
  'https://pizzaadmin.neosao.co.in/api/v1/mas/vx/ingredients?sign_key=akjsh3h28jais1poqpamvg1'

const handleResponse = async (response, entity) => {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    console.error(`Failed to fetch ${entity}:`, response.status, errorText)
    throw new Error(`Unable to load ${entity}. Please try again.`)
  }

  return response.json()
}

export const fetchPizzas = async () => {
  const response = await fetch(PIZZA_URL)
  return handleResponse(response, 'pizzas')
}

export const fetchIngredients = async () => {
  const response = await fetch(INGREDIENT_URL)
  return handleResponse(response, 'ingredients')
}


