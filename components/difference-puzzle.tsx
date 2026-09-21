"use client"

import * as React from "react"

const stars = [
  [214, 402, 7],
  [318, 366, 7],
  [408, 388, 4],
  [470, 330, 4],
  [560, 352, 4],
  [646, 300, 4],
  [742, 336, 4],
] as const

export function DifferencePuzzle({
  first,
  second,
}: {
  first: string
  second: string
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const firstRef = React.useRef<HTMLImageElement>(null)
  const secondRef = React.useRef<HTMLImageElement>(null)
  const [strength, setStrength] = React.useState(0)
  const [loaded, setLoaded] = React.useState(0)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const imageA = firstRef.current
    const imageB = secondRef.current
    const context = canvas?.getContext("2d", { willReadFrequently: true })
    if (!canvas || !context || !imageA?.complete || !imageB?.complete) return

    canvas.width = 1200
    canvas.height = 900
    context.globalCompositeOperation = "source-over"
    context.globalAlpha = 1
    context.drawImage(imageA, 0, 0, canvas.width, canvas.height)
    context.globalCompositeOperation = "difference"
    context.globalAlpha = strength
    context.drawImage(imageB, 0, 0, canvas.width, canvas.height)
    context.globalAlpha = 1
    context.globalCompositeOperation = "source-over"
    canvas.style.filter = `brightness(${1 + strength * 17})`
  }, [first, second, strength, loaded])

  return (
    <section className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <figure className="m-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={firstRef} src={first} width="1200" height="900" alt="Primeira fotografia do mesmo trecho de céu sobre um telhado." className="w-full" onLoad={() => setLoaded((value) => value + 1)} />
          <figcaption className="mt-1 font-mono text-[10px] text-muted-foreground">a.png</figcaption>
        </figure>
        <figure className="m-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={secondRef} src={second} width="1200" height="900" alt="Segunda fotografia do mesmo trecho de céu, um segundo depois." className="w-full" onLoad={() => setLoaded((value) => value + 1)} />
          <figcaption className="mt-1 font-mono text-[10px] text-muted-foreground">b.png</figcaption>
        </figure>
      </div>

      <label className="flex flex-col gap-2 text-sm">
        <span className="flex justify-between font-mono text-xs text-muted-foreground">
          <span>diferença</span><span>{Math.round(strength * 100)}%</span>
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={strength}
          onChange={(event) => setStrength(Number(event.target.value))}
          aria-label="Intensidade da diferença entre as fotografias"
          className="w-full accent-[#c9944f]"
        />
      </label>

      <figure className="m-0 border border-border p-2">
        <canvas ref={canvasRef} className="block h-auto w-full" aria-label="Sobreposição de diferença das duas fotografias; ajuste o controle para revelar o que mudou." />
        <figcaption className="mt-2 text-xs text-muted-foreground">uma imagem subtraída da outra</figcaption>
      </figure>

      <details className="text-sm text-muted-foreground">
        <summary className="w-fit cursor-pointer underline underline-offset-4">ver como dados</summary>
        <p className="mt-3 leading-relaxed">
          Sete pontos presentes na segunda fotografia e ausentes na primeira, em: {stars.map(([x, y, radius]) => `(${x},${y}) raio ${radius}`).join("; ")}.
        </p>
      </details>
    </section>
  )
}
