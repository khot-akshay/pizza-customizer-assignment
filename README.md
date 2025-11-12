# Pizza Customizer

A responsive React + Tailwind application that lists pizzas from a public API, lets users customise their favourite pie, and provides a live price breakdown before confirming the order.

## Tech Stack
- React (Vite)
- Tailwind CSS
- Vitest + Testing Library (unit testing)

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Start the dev server
   ```bash
   npm run dev
   ```
3. Run unit tests
   ```bash
   npm run test
   ```

## Project Structure
```
src/
  api/          // Fetch helpers for pizzas and ingredients
  components/   // Reusable UI building blocks (grid, cards, modal, loader)
  hooks/        // Shared hooks (useFetch)
  utils/        // Mapping helpers + pricing utilities
tests/          // Vitest unit tests (calcTotal coverage)
```

## Features
- Pizza catalogue with image, category, and per-size pricing in a responsive grid.
- Customisation modal with controls for size, crust, special base, and toppings (split by multiplier).
- Live total price calculation with unit-tested logic.
- Graceful loading and error states for pizza and ingredient requests.
- Accessible, keyboard-friendly controls and semantic HTML.

## Assumptions & Notes
- API payloads can vary; `mapPizza` and `mapIngredients` normalise shapes before components consume them.
- Ingredient items flagged as "count as two" rely on `count` (when available) or fall back to a multiplier of 2.
- Currency is formatted in INR (`en-IN`) because the public API is hosted in `.in`.
- The confirm action logs the final order summary to the console instead of persisting it.
- Images are requested directly from the API response. If a pizza lacks an image, a placeholder block is shown.

## Limitations
- No offline caching beyond in-memory storage per session.
- Focus trapping inside the modal is not implemented; the overlay closes on outside click or Escape.

## Demo Script
1. Load the app (`npm run dev`), wait for pizzas to appear.
2. Click **Customize** on any pizza.
3. Change size, pick a crust and special base, toggle toppings.
4. Observe the total updating in the footer.
5. Click **Confirm Selection** and check the browser console for the JSON payload.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
