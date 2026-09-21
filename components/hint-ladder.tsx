"use client"

import * as React from "react"

import { revealHint, revealSolution } from "@/app/actions"
import { Button } from "@/components/ui/button"

const LABELS = ["Uma direção", "Onde procurar", "Quase tudo"] as const

/**
 * As três dicas abrem em ordem, e a solução fica atrás delas. O jogador que
 * quer estragar a própria partida consegue; o que só queria um empurrão não
 * leva a resposta junto sem querer.
 */
export function HintLadder({ index }: { index: number }) {
  const [hints, setHints] = React.useState<string[]>([])
  const [solution, setSolution] = React.useState<string | null>(null)
  const [pending, startTransition] = React.useTransition()

  const nextLevel = hints.length + 1

  function openHint() {
    if (nextLevel > 3) return

    startTransition(async () => {
      const text = await revealHint(index, nextLevel as 1 | 2 | 3)
      if (text) setHints((current) => [...current, text])
    })
  }

  function openSolution() {
    startTransition(async () => {
      const text = await revealSolution(index)
      if (text) setSolution(text)
    })
  }

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-6">
      {hints.length > 0 && (
        <ol className="flex flex-col gap-3">
          {hints.map((hint, i) => (
            <li key={i} className="text-sm leading-relaxed">
              <span className="mr-2 font-mono text-xs text-muted-foreground">
                {LABELS[i]}
              </span>
              {hint}
            </li>
          ))}
        </ol>
      )}

      {solution && (
        <p className="border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground">
          {solution}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {nextLevel <= 3 && (
          <Button variant="ghost" size="sm" onClick={openHint} disabled={pending}>
            {hints.length === 0 ? "Pedir uma dica" : `Pedir a ${nextLevel}ª dica`}
          </Button>
        )}

        {hints.length === 3 && !solution && (
          <Button
            variant="ghost"
            size="sm"
            onClick={openSolution}
            disabled={pending}
          >
            Mostrar a solução
          </Button>
        )}
      </div>
    </div>
  )
}
