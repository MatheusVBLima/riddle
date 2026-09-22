"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { submitFinalName, type AnswerResult } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { markSolved } from "@/lib/progress"

const slots = [1, 2, 3, 4, 5, 6] as const

export function FinalMetaPuzzle() {
  const router = useRouter()
  const [letters, setLetters] = React.useState<string[]>(["", "", "", "", "", ""])
  const [answer, setAnswer] = React.useState("")
  const [result, setResult] = React.useState<AnswerResult | null>(null)
  const [pending, startTransition] = React.useTransition()
  const complete = letters.every((letter) => /^[A-Z]$/.test(letter))

  function setLetter(index: number, value: string) {
    const next = [...letters]
    next[index] = value.slice(-1).toUpperCase()
    setLetters(next)
    setResult(null)
  }

  function finish(event: React.FormEvent) {
    event.preventDefault()
    startTransition(async () => {
      const outcome = await submitFinalName(letters, answer)
      setResult(outcome)
      if (outcome.status !== "correct") return
      markSolved(30, outcome.answer)
      router.push("/vigilia")
    })
  }

  return (
    <section className="flex flex-col gap-6 border-t border-border pt-6" aria-label="Meta final">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="border border-border p-3">
          <span className="font-mono text-[10px] text-muted-foreground">PRIMEIRO PERCURSO</span>
          <p className="mt-2 font-serif">a viagem termina olhando para o alto</p>
        </div>
        <div className="border border-border p-3">
          <span className="font-mono text-[10px] text-muted-foreground">SEGUNDO PERCURSO</span>
          <p className="mt-2 font-serif">a subida termina olhando para o alto</p>
        </div>
        <div className="border border-border p-3">
          <span className="font-mono text-[10px] text-muted-foreground">TERCEIRO PERCURSO</span>
          <p className="mt-2 font-serif">o movimento termina olhando para o alto</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Seis letras da extração final">
        {slots.map((slot, index) => (
          <Input
            key={slot}
            value={letters[index]}
            onChange={(event) => setLetter(index, event.target.value)}
            maxLength={1}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            aria-label={"Letra " + slot + " da palavra final"}
            className="size-12 px-0 text-center font-mono text-xl uppercase"
            disabled={pending || result?.status === "correct"}
          />
        ))}
      </div>

      <form onSubmit={finish} className="flex flex-col gap-3">
        <label htmlFor="final-answer" className="text-sm text-muted-foreground">confirme a palavra encontrada</label>
        <div className="flex gap-2">
          <Input
            id="final-answer"
            value={answer}
            onChange={(event) => { setAnswer(event.target.value); setResult(null) }}
            disabled={!complete || pending || result?.status === "correct"}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="font-mono"
          />
          <Button type="submit" disabled={!complete || pending || result?.status === "correct"}>
            {pending ? "Conferindo" : "Responder"}
          </Button>
        </div>
        <p role="status" aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
          {!complete && "preencha os seis espaços da extração"}
          {result?.status === "wrong" && "A ordem ainda não fecha. Releia os três finais e as nove esferas."}
          {result?.status === "empty" && "Escreva alguma coisa antes de enviar."}
          {result?.status === "rate-limited" && "O arquivo não responde a pressa."}
        </p>
      </form>
    </section>
  )
}
