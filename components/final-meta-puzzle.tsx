"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { submitFinalName, submitGap, type AnswerResult } from "@/app/actions"
import { FlowerMark } from "@/components/flower-mark"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { markSolved } from "@/lib/progress"

const records = ["02", "05", "08", "12", "15", "17", "22", "25", "28"] as const
const storageKey = "vigilia:reconstrucao"

type LetterMap = Partial<Record<(typeof records)[number], string>>

function parseSaved(raw: string): LetterMap {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {}
    return Object.fromEntries(records.flatMap((record) => {
      const value = (parsed as Record<string, unknown>)[record]
      return typeof value === "string" && /^[A-Z]$/.test(value) ? [[record, value]] : []
    }))
  } catch {
    return {}
  }
}

function storedSnapshot() {
  try {
    return window.localStorage.getItem(storageKey) ?? "{}"
  } catch {
    return "{}"
  }
}

function subscribeToStoredLetters(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener("vigilia:reconstruction", callback)
  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener("vigilia:reconstruction", callback)
  }
}

export function FinalMetaPuzzle() {
  const router = useRouter()
  const saved = React.useSyncExternalStore(subscribeToStoredLetters, storedSnapshot, () => "{}")
  const [liveLetters, setLiveLetters] = React.useState<LetterMap>({})
  const letters = React.useMemo(() => ({ ...parseSaved(saved), ...liveLetters }), [saved, liveLetters])
  const [drafts, setDrafts] = React.useState<LetterMap>({})
  const [pendingRecord, setPendingRecord] = React.useState<string | null>(null)
  const [gapMessage, setGapMessage] = React.useState("")
  const [answer, setAnswer] = React.useState("")
  const [result, setResult] = React.useState<AnswerResult | null>(null)
  const [pending, startTransition] = React.useTransition()
  const complete = records.every((record) => letters[record])

  function checkGap(record: (typeof records)[number]) {
    const value = (drafts[record] ?? "").trim().slice(0, 1)
    if (!value) {
      setGapMessage(`Escreva uma letra para o registro ${record}.`)
      return
    }

    setPendingRecord(record)
    setGapMessage("")
    startTransition(async () => {
      const response = await submitGap(record, value)
      setPendingRecord(null)
      if (!response.correct) {
        setGapMessage(response.rateLimited ? "O arquivo não responde a pressa." : "Essa letra não fecha esta lacuna.")
        return
      }

      const next = { ...letters, [record]: value.toUpperCase() }
      setLiveLetters(next)
      setDrafts((current) => ({ ...current, [record]: value.toUpperCase() }))
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next))
        window.dispatchEvent(new Event("vigilia:reconstruction"))
      } catch {
        // The player can still finish this visit if storage is unavailable.
      }
    })
  }

  function finish(event: React.FormEvent) {
    event.preventDefault()
    const orderedLetters = records.map((record) => letters[record] ?? "")
    startTransition(async () => {
      const outcome = await submitFinalName(orderedLetters, answer)
      setResult(outcome)
      if (outcome.status !== "correct") return
      markSolved(30, outcome.answer)
      router.push("/vigilia")
    })
  }

  return (
    <section className="flex flex-col gap-7" aria-label="Lacunas do arquivo">
      <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-9">
        {records.map((record) => (
          <div key={record} className="flex min-w-0 flex-col items-center gap-2">
            <FlowerMark className="size-5" />
            <Input
              value={letters[record] ?? drafts[record] ?? ""}
              onChange={(event) => {
                const value = event.target.value.slice(-1).toUpperCase()
                setDrafts((current) => ({ ...current, [record]: value }))
                setGapMessage("")
              }}
              maxLength={1}
              disabled={Boolean(letters[record]) || pending}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
            aria-label={`Letra a completar no registro ${record}`}
              className="h-11 w-11 px-0 text-center font-mono text-lg uppercase"
            />
            <span className="font-mono text-[10px] text-muted-foreground">{record}</span>
            {!letters[record] && (
              <Button type="button" size="sm" variant="ghost" onClick={() => checkGap(record)} disabled={pending} className="px-1 text-[10px]">
                {pendingRecord === record ? "..." : "devolver"}
              </Button>
            )}
          </div>
        ))}
      </div>

      <p role="status" aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
        {gapMessage}
      </p>

      <div className="flex min-h-[12rem] items-center justify-center overflow-hidden" aria-live="polite">
        <FlowerMark className={`final-mark${complete ? " final-mark--open" : ""}`} />
      </div>

      <form onSubmit={finish} className="flex flex-col gap-3">
        <label htmlFor="final-answer" className="text-sm text-muted-foreground">e então escreva o que estava escondido</label>
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
          {!complete && "devolva uma letra em cada moldura"}
          {result?.status === "wrong" && "Não é isso. A pista ainda está nas páginas."}
          {result?.status === "empty" && "Escreva alguma coisa antes de enviar."}
          {result?.status === "rate-limited" && "O arquivo não responde a pressa."}
        </p>
      </form>
    </section>
  )
}
