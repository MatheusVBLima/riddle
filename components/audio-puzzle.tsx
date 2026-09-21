"use client"

import * as React from "react"

export function AudioPuzzle({
  src,
  summary,
  peaks,
  duration,
  canChangeSpeed = false,
}: {
  src: string
  summary: string
  peaks: number[]
  duration: number
  canChangeSpeed?: boolean
}) {
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [rate, setRate] = React.useState(1)

  function changeRate(nextRate: number) {
    setRate(nextRate)
    if (audioRef.current) audioRef.current.playbackRate = nextRate
  }

  return (
    <figure className="flex flex-col gap-4">
      <audio ref={audioRef} controls preload="none" className="w-full">
        <source src={src} type="audio/wav" />
        Seu navegador não conseguiu abrir esta gravação.
      </audio>

      <svg
        viewBox="0 0 720 112"
        role="img"
        aria-label="Forma de onda com marcas de tempo"
        className="h-auto w-full text-muted-foreground"
      >
        <line x1="0" y1="56" x2="720" y2="56" stroke="currentColor" opacity=".45" />
        {Array.from({ length: Math.floor(duration / 2) + 1 }, (_, second) => (
          <g key={second}>
            <line
              x1={(second / (duration / 2)) * 720}
              y1="48"
              x2={(second / (duration / 2)) * 720}
              y2="64"
              stroke="currentColor"
              opacity=".45"
            />
            {second % 2 === 0 && (
              <text
              x={(second / (duration / 2)) * 720 + 3}
                y="82"
                fontSize="10"
                fill="currentColor"
                fontFamily="monospace"
              >
                {String(second * 2).padStart(2, "0")}s
              </text>
            )}
          </g>
        ))}
        {peaks.map((time, index) => {
          const x = (time / duration) * 720
          const height = canChangeSpeed ? 5 + ((index * 17) % 20) : 15
          return (
            <line
              key={`${time}-${index}`}
              x1={x}
              y1={56 - height}
              x2={x}
              y2={56 + height}
              stroke="currentColor"
              strokeWidth="2"
            />
          )
        })}
      </svg>

      <figcaption className="flex flex-col gap-3">
        <p className="font-mono text-xs text-muted-foreground">
          {duration} s · mono · 44,1 kHz
        </p>

        {canChangeSpeed && (
          <fieldset className="flex flex-wrap items-center gap-2">
            <legend className="mb-2 text-sm text-muted-foreground">
              Velocidade
            </legend>
            {[1, 2, 4, 8].map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={rate === value}
                onClick={() => changeRate(value)}
                className="rounded-sm border border-border px-3 py-1.5 text-sm hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {value}×
              </button>
            ))}
          </fieldset>
        )}

        <details className="group text-sm text-muted-foreground">
          <summary className="w-fit cursor-pointer underline underline-offset-4 hover:text-foreground">
            descrição do som
          </summary>
          <p className="mt-3 leading-relaxed">{summary}</p>
        </details>
      </figcaption>
    </figure>
  )
}
