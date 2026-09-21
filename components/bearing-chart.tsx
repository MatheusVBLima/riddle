"use client"

import * as React from "react"
import { BEARINGS_25 } from "@/lib/chart"

const origin = { x: 64, y: 28 }
const cellSize = 47.5

function center(cell: string) {
  const column = cell.charCodeAt(0) - 65
  const row = Number(cell.slice(1)) - 1
  return {
    x: origin.x + (column + 0.5) * cellSize,
    y: origin.y + (row + 0.5) * cellSize,
  }
}

function intersectionData() {
  const points = BEARINGS_25.map((bearing) => {
    const start = center(bearing.cell)
    const radians = bearing.degrees * Math.PI / 180
    return { ...bearing, ...start, dx: Math.sin(radians), dy: -Math.cos(radians) }
  })
  const hits: string[] = []

  for (let first = 0; first < points.length; first++) {
    for (let second = first + 1; second < points.length; second++) {
      const a = points[first]
      const b = points[second]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const determinant = a.dx * b.dy - a.dy * b.dx
      if (Math.abs(determinant) < 0.001) continue
      const distance = (dx * b.dy - dy * b.dx) / determinant
      const otherDistance = (dx * a.dy - dy * a.dx) / determinant
      if (distance < 0 || otherDistance < 0) continue
      const x = (a.x + distance * a.dx - origin.x) / cellSize
      const y = (a.y + distance * a.dy - origin.y) / cellSize
      hits.push(`${a.id}×${b.id}: ${x.toFixed(2)}, ${y.toFixed(2)}`)
    }
  }

  return hits
}

export function BearingChart({ assetSrc }: { assetSrc: string }) {
  const [lengths, setLengths] = React.useState([0, 0, 0, 0, 0])

  function setLength(index: number, value: number) {
    setLengths((current) => current.map((length, position) => position === index ? value : length))
  }

  return (
    <section className="flex flex-col gap-6" aria-label="Instrumento de marcação">
      <figure className="m-0 overflow-x-auto border border-border bg-[#0a0a0b] p-2">
        <div className="relative mx-auto aspect-[1120/760] min-w-[720px] w-full max-w-6xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetSrc}
            width="1120"
            height="760"
            alt="Grade hidrográfica alfanumérica, costa, linhas de sonda e cartela de sinais. A moldura D está vazia e marcada pela flor. Em H8 há uma marca com aro circular, haste central e dois braços curvos."
            className="absolute inset-0 size-full"
          />
          <svg
            viewBox="0 0 1120 760"
            aria-hidden="true"
            focusable="false"
            className="pointer-events-none absolute inset-0 size-full"
          >
            <defs>
              <clipPath id="plot-area-25">
                <rect x={origin.x} y={origin.y} width={16 * cellSize} height={14 * cellSize} />
              </clipPath>
            </defs>
            <g clipPath="url(#plot-area-25)">
              {BEARINGS_25.map((bearing, index) => {
                const start = center(bearing.cell)
                const radians = bearing.degrees * Math.PI / 180
                const distance = lengths[index] * 900
                const end = {
                  x: start.x + Math.sin(radians) * distance,
                  y: start.y - Math.cos(radians) * distance,
                }

                return lengths[index] > 0 ? (
                  <line
                    key={`line-${bearing.id}`}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke="#e9e4d8"
                    strokeWidth="1.5"
                    strokeDasharray="5 4"
                  />
                ) : null
              })}
            </g>
            {BEARINGS_25.map((bearing) => {
              const start = center(bearing.cell)
              return (
                <g key={bearing.id}>
                  <path d={`M${start.x} ${start.y - 8}l7 14h-14z`} fill="#c9944f" />
                  <text
                    x={start.x + 8}
                    y={start.y - 8}
                    fill="#e9e4d8"
                    fontFamily="monospace"
                    fontSize="11"
                  >
                    {bearing.id} {bearing.cell} · {String(bearing.degrees).padStart(3, "0")}°
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
        <figcaption className="px-2 pb-2 text-xs text-muted-foreground">
          as cinco medidas não se encontram. nenhuma está errada.
        </figcaption>
      </figure>

      <div role="group" aria-label="Estenda cada régua no rumo indicado" className="flex flex-col gap-4">
        {BEARINGS_25.map((bearing, index) => (
          <label key={bearing.id} className="grid grid-cols-[3rem_1fr] items-center gap-3 text-xs">
            <span className="font-mono text-muted-foreground">{bearing.id}</span>
            <input
              type="range"
              min="0"
              max="0.9"
              step="0.01"
              value={lengths[index]}
              onChange={(event) => setLength(index, Number(event.target.value))}
              aria-label={`Estender a régua de ${bearing.cell}, rumo ${bearing.degrees} graus`}
              className="w-full accent-[#c9944f]"
            />
          </label>
        ))}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setLengths([0.9, 0.9, 0.9, 0.9, 0.9])}
            className="w-fit text-xs underline underline-offset-4"
          >
            traçar todas
          </button>
          <a href="#rumos-como-dados" className="text-xs underline underline-offset-4">
            ver como dados
          </a>
        </div>
      </div>

      <details id="rumos-como-dados" className="text-sm text-muted-foreground">
        <summary className="w-fit cursor-pointer underline underline-offset-4">coordenadas das marcações</summary>
        <p className="mt-3 leading-relaxed">
          {BEARINGS_25.map(({ id, cell, degrees }) => `${id} ${cell} ${String(degrees).padStart(3, "0")}°`).join(" · ")}. Interseções em coordenadas de célula: {intersectionData().join("; ")}.
        </p>
        <p className="mt-3 leading-relaxed">
          Em H8, a marca isolada tem um aro circular no alto, uma haste vertical, uma barra e dois braços curvos na base.
        </p>
      </details>
    </section>
  )
}
