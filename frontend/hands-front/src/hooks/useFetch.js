import { useEffect, useState } from 'react'

// `fetcher` precisa ser uma função estável (declarada fora do componente)
export default function useFetch(fetcher) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let active = true
    fetcher()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => active && setState({ data: null, loading: false, error }))
    return () => {
      active = false
    }
  }, [fetcher])

  return state
}
