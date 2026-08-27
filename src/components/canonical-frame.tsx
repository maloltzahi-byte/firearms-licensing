type CanonicalFrameProps = {
  src: string
  title: string
}

export function CanonicalFrame({ src, title }: CanonicalFrameProps) {
  return (
    <main className="h-[100dvh] w-full overflow-hidden bg-[#f7f9fb]">
      <iframe
        className="h-full w-full border-0"
        src={src}
        title={title}
        sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts allow-downloads"
      />
    </main>
  )
}
