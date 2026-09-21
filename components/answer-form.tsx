"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { submitAnswer, type AnswerResult } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { markSolved } from "@/lib/progress"

export function AnswerForm({ index }: { index: number }) {
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

      markSolved(index)
      if (outcome.next) router.push(`/f/${outcome.next}`)
    })
  }

  // Digitar de novo apaga o erro anterior: a recusa é do palpite passado.
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value)
    if (result) setResult(null)
  }

  const solved = result?.status === "correct"

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
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

      <p
        role="status"
        aria-live="polite"
        className="min-h-5 text-sm text-muted-foreground"
      >
        {result?.status === "wrong" && "Não é isso. A pista ainda está na página."}
        {result?.status === "empty" && "Escreva alguma coisa antes de enviar."}
        {solved && !result.next && "Você chegou ao fim do que existe até agora."}
        {solved && result.next && "Certo. Abrindo a próxima."}
      </p>
    </form>
  )
}
