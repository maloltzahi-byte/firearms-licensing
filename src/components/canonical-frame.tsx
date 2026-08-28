'use client'

import { useCallback } from 'react'

type CanonicalFrameProps = {
  src: string
  title: string
}

const INTERMEDIATE_VIEWPORT_PATCH = `
@media (min-width: 901px) and (max-width: 1399px) {
  .instrument { left: 290px !important; width: calc(100vw - 330px) !important; }
  .footer-back { left: 290px !important; }
  .footer-next { left: auto !important; right: 40px !important; }
  .save { left: 455px !important; width: min(320px, calc(100vw - 760px)) !important; }
  .main-code, .main-title, .main-body { right: 60px !important; max-width: calc(100vw - 410px) !important; }
  .accent { right: 60px !important; }
  .choice .cs { width: calc(100% - 340px) !important; }
}
`

export function CanonicalFrame({ src, title }: CanonicalFrameProps) {
  const handleLoad = useCallback((event: React.SyntheticEvent<HTMLIFrameElement>) => {
    const frame = event.currentTarget
    if (!src.includes('/canonical/guided.html')) return

    try {
      const doc = frame.contentDocument
      if (!doc || doc.getElementById('rfl-intermediate-viewport-patch')) return
      const style = doc.createElement('style')
      style.id = 'rfl-intermediate-viewport-patch'
      style.textContent = INTERMEDIATE_VIEWPORT_PATCH
      doc.head.appendChild(style)
    } catch {
      // The canonical assets are same-origin in production. If that ever changes,
      // the frame must remain usable without broadening cross-origin permissions.
    }
  }, [src])

  return (
    <main className="h-[100dvh] w-full overflow-hidden bg-[#f7f9fb]">
      <iframe
        className="h-full w-full border-0"
        src={src}
        title={title}
        sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts allow-downloads allow-top-navigation-by-user-activation"
        onLoad={handleLoad}
      />
    </main>
  )
}
