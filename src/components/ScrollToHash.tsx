import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToHashWithRetry } from '@/lib/scrollToHash'

/** Scrolls to the current URL hash after SPA navigation (e.g. /#servicios). */
export function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    return scrollToHashWithRetry(id)
  }, [pathname, hash])

  return null
}
