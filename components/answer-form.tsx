"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { submitAnswer, type AnswerResult } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { markSolved } from "@/lib/progress"

export function AnswerForm({ index, shape }: { index: number; shape: number[] }) {
  const router = useRouter()
  const [value, setValue] = React.useState("")
  const [result, setResult] = React.useState<AnswerResult | null>(null)
  const [pending, startTransition] = React.useTransition()

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()

    startTransition(async () => {
      const outcome = await submitAnswer(index, value)
      setResult(outcome)

      if (outcome.status !== "correct") return

      markSolved(index, outcome.answer)
      router.push(outcome.next ? `/f/${outcome.next}` : "/vigilia")
    })
  }

  // Digitar de novo apaga o erro anterior: a recusa é do palpite passado.
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value)
    if (result) setResult(null)
  }

  const solved = result?.status === "correct"

  return (
    <form onSubmit={onSubmit} className="answer-form flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={onChange}
          disabled={pending || solved}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Sua resposta"
          placeholder="resposta"
          className="font-mono"
        />
        <Button type="submit" disabled={pending || solved}>
          {pending ? "Conferindo" : "Responder"}
        </Button>
      </div>

      {shape.length > 0 && (
        <p className="font-mono text-xs text-muted-foreground">
          formato · <span className="tracking-[.3em]">{shape.map((length) => "_".repeat(length)).join("  ")}</span> ({shape.join(" + ")})
        </p>
      )}

      <p
        role="status"
        aria-live="polite"
        className="min-h-5 text-sm text-muted-foreground"
      >
        {result?.status === "wrong" && "Não é isso. A pista ainda está na página."}
        {result?.status === "rejected" && <span className="text-vigil">{result.message}</span>}
        {result?.status === "rate-limited" && "O arquivo não responde a pressa."}
        {result?.status === "empty" && "Escreva alguma coisa antes de enviar."}
        {solved && !result.next && "Certo. O arquivo se fecha."}
        {solved && result.next && "Certo. Abrindo a próxima."}
      </p>
    </form>
  )
}
