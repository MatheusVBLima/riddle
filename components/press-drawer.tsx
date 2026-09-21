"use client"

import * as React from "react"

import { revealDrawer } from "@/app/actions"

export function PressDrawer() {
  const [label, setLabel] = React.useState<string | null>(null)
  const [pending, startTransition] = React.useTransition()

  function open() {
    startTransition(async () => setLabel(await revealDrawer()))
  }

  return (
    <section className="flex flex-col gap-5" aria-label="Armação de madeira">
      <svg viewBox="0 0 400 470" role="img" aria-labelledby="press-title press-desc" className="mx-auto w-full max-w-sm">
        <title id="press-title">Armação de madeira com quatro gavetas</title>
        <desc id="press-desc">Armação de duas tábuas, quatro parafusos-borboleta e quatro gavetas na base. Três gavetas têm puxador; a quarta não.</desc>
        <g fill="none" stroke="#9d988c" strokeWidth="5">
          <path d="M62 96H338M62 126H338M85 96V350M315 96V350M85 350H315" />
          <path d="M62 96 42 75m296 21 20-21M62 126l-20 21m296-21 20 21" />
          <path d="M50 64v24m300-24v24M50 135v24m300-24v24" />
          <path d="M110 350v55m60-55v55m60-55v55m60-55v55" />
          <path d="M96 405h208v35H96z" />
          <path d="M108 412h38v21h-38zM158 412h38v21h-38zM208 412h38v21h-38z" />
        </g>
        <g fill="#9d988c">
          <circle cx="127" cy="422" r="3" />
          <circle cx="177" cy="422" r="3" />
          <circle cx="227" cy="422" r="3" />
        </g>
        <rect x="258" y="412" width="38" height="21" fill="#111113" stroke="#9d988c" />
        <rect x="257" y="411" width="40" height="23" fill="transparent" />
      </svg>
      <button
        type="button"
        onClick={open}
        disabled={pending}
        aria-expanded={label !== null}
        className="mx-auto rounded-sm border border-border px-4 py-2 text-sm hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
      >
        {pending ? "abrindo" : "abrir a gaveta sem puxador"}
      </button>
      {label && <p role="status" className="text-center font-mono text-sm text-foreground">{label}</p>}
      {/* The raw strip preserves the missing braille cell exactly. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/r/17/etiquetas.svg"
        width="520"
        height="76"
        alt="Fita de 26 células em braile, da letra A à Z; a décima oitava célula está lisa, com uma pequena marca ocre ao lado."
        className="w-full"
      />
    </section>
  )
}
