"use client"

import * as React from "react"

export function BookZoom({ src, note }: { src: string; note: string }) {
  const [zoom, setZoom] = React.useState(1)
  const [showNote, setShowNote] = React.useState(false)

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "+" || event.key === "=") setZoom((value) => Math.min(2.4, value + 0.1))
      if (event.key === "-") setZoom((value) => Math.max(1, value - 0.1))
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <section className="flex flex-col gap-4">
      <div className="overflow-auto border border-border bg-[#0a0a0b] p-2">
        {/* Raw image preserves its intended resolution and embedded detail. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          width="2600"
          height="1700"
          alt="Livro aberto visto de cima; as páginas trazem números no canto externo; a folha colada à capa é mais grossa, não tem número e tem uma anotação a lápis no canto."
          className="mx-auto h-auto origin-top"
          style={{ transform: `scale(${zoom})` }}
        />
      </div>
      <label className="flex flex-col gap-2 text-xs text-muted-foreground">
        <span className="flex justify-between"><span>ampliação</span><span>{Math.round(zoom * 100)}%</span></span>
        <input type="range" min="1" max="2.4" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} aria-label="Ampliar a fotografia do livro" className="accent-[#c9944f]" />
      </label>
      <button type="button" onClick={() => setShowNote((value) => !value)} className="w-fit text-sm underline underline-offset-4">
        {showNote ? "ocultar anotação" : "ler a anotação"}
      </button>
      {showNote && <p role="status" className="font-serif text-lg text-muted-foreground">{note}</p>}
      <p className="text-xs text-muted-foreground">Use + e − para ampliar ou reduzir. A imagem original tem resolução para leitura.</p>
    </section>
  )
}
