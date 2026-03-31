import { useState, useEffect } from "react"

type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string }

export function useApiData<T>(
  fetcher: () => Promise<T>,
  refreshMs?: number
) {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" })

  useEffect(() => {
    let cancelled = false

    async function doFetch() {
      try {
        const data = await fetcher()
        if (!cancelled) setState({ status: "success", data })
      } catch (err) {
        if (!cancelled) setState({ status: "error", error: String(err) })
      }
    }

    doFetch()

    if (refreshMs) {
      const id = setInterval(doFetch, refreshMs)
      return () => {
        cancelled = true
        clearInterval(id)
      }
    }

    return () => {
      cancelled = true
    }
  }, [fetcher, refreshMs])

  return state
}
