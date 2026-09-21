"use client"

import * as React from "react"

const pressureMarks =
  "…e a costura aguentou. 95 folhas. pauta de 8 mm."

export function LightRaking() {
  const [contrast, setContrast] = React.useState(1)
  const [read, setRead] = React.useState(false)

  return (
    <figure className="flex flex-col gap-4">
      <div className="relative">
        {/* Raw file: the puzzle relies on its stable name and lossless pixels. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/r/09/pagina-03.webp"
          width="1200"
          height="1600"
          alt="folha pautada, aparentemente sem tinta"
          className="h-auto w-full"
          style={{
            filter: `contrast(${1 + ((contrast - 1) / 25) * 0.1}) brightness(${1 + ((contrast - 1) / 25) * 0.01})`,
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[16%] top-[25%] w-[72%] rotate-[-0.5deg] font-serif text-sm leading-relaxed text-[#383228] sm:text-lg"
          style={{ opacity: ((contrast - 1) / 25) * 0.92 }}
        >
          {pressureMarks}
        </span>
      </div>

      <label className="flex flex-col gap-2 text-sm text-muted-foreground">
        <span>luz rasante</span>
        <input
          type="range"
          min="1"
          max="26"
          value={contrast}
          onChange={(event) => setContrast(Number(event.target.value))}
          aria-label="luz rasante: aumenta o contraste da folha"
          className="w-full accent-[#72aba3]"
        />
      </label>

      <button
        type="button"
        aria-expanded={read}
        onClick={() => setRead((current) => !current)}
        className="w-fit text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        {read ? "fechar leitura" : "ler a folha"}
      </button>

      {read && <p className="font-serif leading-relaxed">{pressureMarks}</p>}
    </figure>
  )
}
