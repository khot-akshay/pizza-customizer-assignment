import { useEffect, useMemo, useRef, useState } from 'react'

export const useFetch = (fetcher, options = {}) => {
  const { enabled = true, dependencies = [], initialData = null } = options
  const [data, setData] = useState(initialData)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(Boolean(enabled))

  const fetcherRef = useRef(fetcher)

  useEffect(() => {
    fetcherRef.current = fetcher
  }, [fetcher])

  const depsString = useMemo(() => {
    const wrapped = Array.isArray(dependencies) ? dependencies : [dependencies]
    return JSON.stringify(wrapped)
  }, [dependencies])

  useEffect(() => {
    if (!enabled) return undefined

    let cancelled = false

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetcherRef.current()
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch data'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [enabled, depsString])

  const refetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetcherRef.current()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'))
    } finally {
      setLoading(false)
    }
  }

  return { data, error, loading, refetch }
}

export default useFetch


