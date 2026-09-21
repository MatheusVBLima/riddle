"use client"

import * as React from "react"

import { revealHint, revealSolution } from "@/app/actions"
import { Button } from "@/components/ui/button"

/**
 * Uma dica por fase, e a solução atrás dela. Quem só queria um empurrão não
 * leva a resposta junto sem querer; quem quer desistir ainda consegue, em dois
 * passos deliberados.
 */
export function HintPanel({ index }: { index: number }) {
  const [hint, setHint] = React.useState<string | null>(null)
  const [solution, setSolution] = React.useState<string | null>(null)
  const [pending, startTransition] = React.useTransition()

  function openHint() {
    startTransition(async () => {
      const text = await revealHint(index)
      if (text) setHint(text)
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
      {hint && <p className="text-sm leading-relaxed">{hint}</p>}

      {solution && (
        <p className="border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground">
          {solution}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {!hint && (
          <Button variant="ghost" size="sm" onClick={openHint} disabled={pending}>
            Pedir a dica
          </Button>
        )}

        {hint && !solution && (
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
