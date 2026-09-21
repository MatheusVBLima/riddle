"use client"

import * as React from "react"

type Channel = 0 | 1 | 2 | 3

const names = ["R", "G", "B", "tudo"] as const

export function ChannelPuzzle() {
  const imageRef = React.useRef<HTMLImageElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [channel, setChannel] = React.useState<Channel>(3)

  const draw = React.useCallback(() => {
    const image = imageRef.current
    const canvas = canvasRef.current
    if (!image || !canvas || !image.complete || !image.naturalWidth) return

    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (!context) return
    context.drawImage(image, 0, 0)

    if (channel === 3) return
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height)
    for (let offset = 0; offset < pixels.data.length; offset += 4) {
      const value = pixels.data[offset + channel]
      pixels.data[offset] = value
      pixels.data[offset + 1] = value
      pixels.data[offset + 2] = value
    }
    context.putImageData(pixels, 0, 0)
  }, [channel])

  React.useEffect(draw, [draw])

  return (
    <section className="flex flex-col gap-4" aria-label="Imagem separada por canais">
      {/* Puzzle image stays raw: the color channels are the data. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src="/r/12/vitral.png"
        width="800"
        height="800"
        alt="Ruído colorido com predomínio verde-azulado."
        onLoad={draw}
        className="hidden"
      />
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Imagem de 800 por 800; visualização do canal ${names[channel]}.`}
        className="aspect-square w-full border border-border bg-[#111113]"
      />
      <fieldset className="flex flex-wrap gap-2">
        <legend className="mb-2 text-sm text-muted-foreground">canal</legend>
        {names.map((name, value) => (
          <button
            key={name}
            type="button"
            aria-pressed={channel === value}
            onClick={() => setChannel(value as Channel)}
            className="rounded-sm border border-border px-3 py-1.5 font-mono text-sm hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {name}
          </button>
        ))}
      </fieldset>
      <audio controls preload="none" className="w-full">
        <source src="/r/12/calibracao.wav" type="audio/wav" />
        Seu navegador não conseguiu abrir a fita.
      </audio>
      <p className="font-mono text-xs text-muted-foreground">fita de calibração do arquivo · 26 s · mono</p>
      <details className="text-sm text-muted-foreground">
        <summary className="w-fit cursor-pointer underline underline-offset-4">ver como dados</summary>
        <p className="mt-3 leading-relaxed">
          No canal R: desenho de linha com um vaso superior, orifício, gotas,
          vaso inferior com doze marcas numeradas e uma ampulheta riscada com X.
          Os canais G e B contêm ruído. A fita tem 26 tons de um segundo, subindo;
          o sétimo segundo está em silêncio.
        </p>
      </details>
    </section>
  )
}
