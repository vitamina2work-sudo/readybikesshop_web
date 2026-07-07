const HEADER_OFFSET = 80

export function scrollToHash(id: string, behavior: ScrollBehavior = 'smooth') {
  const element = document.getElementById(id)
  if (!element) return false

  const top = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
  window.scrollTo({ top: Math.max(0, top), behavior })
  return true
}

export function scrollToHashWithRetry(id: string, behavior: ScrollBehavior = 'smooth') {
  const run = () => scrollToHash(id, behavior)

  run()
  const timers = [50, 150, 350, 600, 1000].map((delay) =>
    window.setTimeout(run, delay)
  )

  return () => timers.forEach((timer) => window.clearTimeout(timer))
}

export function parseNavHref(href: string) {
  const hashIndex = href.indexOf('#')
  if (hashIndex === -1) {
    return { to: href, isHash: false as const }
  }

  const pathname = href.slice(0, hashIndex) || '/'
  const hash = href.slice(hashIndex)

  return {
    to: { pathname, hash },
    isHash: true as const,
    hashId: hash.slice(1),
    pathname,
    hash,
  }
}
