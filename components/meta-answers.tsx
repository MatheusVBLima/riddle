"use client"

import * as React from "react"

import { solvedAnswers } from "@/lib/progress"

// O histórico vive no localStorage; no servidor a lista sai vazia.
const subscribe = () => () => {}
const getSnapshot = () => JSON.stringify(solvedAnswers())
const emptySnapshot = "[]"

/** As respostas já encontradas no trecho da meta, na ordem das fases. */
export function MetaAnswers({ from, to }: { from: number; to: number }) {
  const answers = (JSON.parse(React.useSyncExternalStore(subscribe, getSnapshot, () => emptySnapshot)) as { index: number; answer: string }[])
    .filter((entry) => entry.index >= from && entry.index <= to)

  if (!answers.length) return null

  return (
    <section aria-label="respostas encontradas" className="grid gap-3 border-y border-border py-4">
      <span className="font-mono text-[10px] tracking-[.22em] text-muted-foreground">O QUE VOCÊ JÁ RECUPEROU</span>
      <ol className="flex flex-wrap gap-2">
        {answers.map((entry) => (
          <li key={entry.index} className="border border-border px-2 py-1 font-mono text-xs">
            <span className="text-muted-foreground">{String(entry.index).padStart(2, "0")} </span>
            {entry.answer}
          </li>
        ))}
      </ol>
    </section>
  )
}
