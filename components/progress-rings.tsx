"use client"

import Link from "next/link"
import * as React from "react"

import { solvedPhases } from "@/lib/progress"

// Servidor e cliente divergem na última casa do float; arredonda para hidratar igual.
const round = (value: number) => Math.round(value * 100) / 100

// Mesmo arranjo do ResumeLink: o progresso vive no localStorage e não muda
// enquanto a home está aberta. No servidor os anéis saem apagados.
const subscribe = () => () => {}
const emptySnapshot = "[]"
const getSnapshot = () => JSON.stringify(solvedPhases())

const geometry = [
  { radius: 68, from: 1, labelY: 161 },
  { radius: 122, from: 11, labelY: 101 },
  { radius: 176, from: 21, labelY: 48 },
] as const

/** Três anéis, dez marcas cada. Uma marca acesa é um registro resolvido. */
export function ProgressRings({ labels }: { labels: readonly [string, string, string] }) {
  const rings = geometry.map((ring, index) => ({ ...ring, label: labels[index] }))
  const solved = new Set<number>(
    JSON.parse(React.useSyncExternalStore(subscribe, getSnapshot, () => emptySnapshot))
  )

  return (
    <svg viewBox="0 0 420 420" role="img" className="dante-svg max-h-[26rem]" aria-labelledby="progress-title">
      <title id="progress-title">
        {"Diagrama de três anéis: " + labels.join(", ") + (solved.size ? "; " + solved.size + " de 30 registros resolvidos" : "")}
      </title>
      <path d="M210 18V402M18 210H402" stroke="#5e5a52" strokeDasharray="2 9" />
      {rings.map((ring, ringIndex) => (
        <g key={ring.label}>
          <circle cx="210" cy="210" r={ring.radius} fill="none" stroke={ringIndex === 0 ? "currentColor" : ringIndex === 1 ? "#8d8578" : "#5e5a52"} strokeWidth={ringIndex === 0 ? 2 : 1} />
          {Array.from({ length: 10 }, (_, step) => {
            const index = ring.from + step
            const angle = -Math.PI / 2 + ((step + 0.5) / 10) * Math.PI * 2
            const x = round(210 + Math.cos(angle) * ring.radius)
            const y = round(210 + Math.sin(angle) * ring.radius)
            const lit = solved.has(index)
            const mark = (
              <circle cx={x} cy={y} r={lit ? 5 : 2.5} fill={lit ? "currentColor" : "#0a0a0b"} stroke={lit ? "none" : "#8d8578"} />
            )
            return lit ? (
              <Link key={index} href={"/f/" + index} aria-label={"registro " + String(index).padStart(2, "0")}>
                {mark}
              </Link>
            ) : (
              <React.Fragment key={index}>{mark}</React.Fragment>
            )
          })}
        </g>
      ))}
      <circle cx="210" cy="210" r="8" fill="currentColor" />
      <g fill="#e9e4d8" fontFamily="monospace" fontSize="11" textAnchor="middle">
        {rings.map((ring) => <text key={ring.label} x="210" y={ring.labelY}>{ring.label}</text>)}
        <text x="210" y="389">o arquivo começa no centro</text>
      </g>
    </svg>
  )
}
