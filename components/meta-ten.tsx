"use client"

import * as React from "react"

import { solvedAnswers, type SolvedAnswer } from "@/lib/progress"

type Label = { index: number; name: string }

const subscribe = () => () => {}
const getSnapshot = () => JSON.stringify(solvedAnswers())
const getServerSnapshot = () => "[]"

function Inventory({ labels }: { labels: Label[] }) {
  const snapshot = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const answers = React.useMemo(
    () => JSON.parse(snapshot) as SolvedAnswer[],
    [snapshot]
  )

  const byIndex = new Map(answers.map((entry) => [entry.index, entry.answer]))

  return (
    <aside className="flex flex-col gap-4 border-t border-border pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
      <h2 className="text-sm text-muted-foreground">inventário</h2>
      <ol className="flex flex-col gap-2 font-mono text-xs tabular-nums">
        {labels.map(({ index, name }) => (
          <li key={index} className="grid grid-cols-[2.5rem_1fr] gap-2">
            <span className="text-muted-foreground">{String(index).padStart(2, "0")}</span>
            <span className="min-w-0 truncate" aria-label={`${name}: ${byIndex.get(index) ?? "ainda não resolvida"}`}>
              {byIndex.get(index) ?? "—"}
            </span>
          </li>
        ))}
      </ol>
    </aside>
  )
}

export function MetaTen({ labels }: { labels: Label[] }) {
  return (
    <section className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_15rem]">
      <div
        role="img"
        aria-label="Fileiras de caixas, com comprimentos de três a onze; uma caixa de cada fileira está contornada em diagonal."
        className="flex flex-col gap-3"
      >
        {Array.from({ length: 9 }, (_, row) => {
          const length = row + 3
          return (
            <div key={length} className="flex items-center gap-3">
              <span className="w-6 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                {length}
              </span>
              <div
                className="grid w-full gap-1"
                style={{ gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))` }}
              >
                {Array.from({ length }, (_, column) => (
                  <span
                    key={column}
                    className={
                      column === row
                        ? "aspect-square border border-foreground"
                        : "aspect-square border border-border"
                    }
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <Inventory labels={labels} />
    </section>
  )
}
