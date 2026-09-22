import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { AnswerForm } from "@/components/answer-form"
import { HintPanel } from "@/components/hint-panel"
import { CanticaMark, PhaseArtifact, PhaseFooter, type PhaseQuery } from "@/components/phase-artifact"
import { Button } from "@/components/ui/button"
import { frozenTitle, levelFrom, MUD_TITLE, riverTitle } from "@/lib/inferno-material"
import {
  choirTitle,
  CROWN_TITLE,
  EAGLE_TITLE,
  EXAM_FAIL_TITLE,
  EXAM_PASS_TITLE,
  examPasses,
  LADDER_TITLE,
} from "@/lib/paradiso-material"
import { answerShape, getPhase, type Phase } from "@/lib/phases"
import { fireOpens, RIVER_BANKS_TITLE, waterState } from "@/lib/purgatorio-material"
import { solvedUpTo } from "@/lib/session"

type Props = {
  params: Promise<{ n: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/** Primeiro valor de cada parâmetro da URL; as fases decidem o que ler. */
async function readQuery(searchParams: Props["searchParams"]): Promise<PhaseQuery> {
  const query = await searchParams
  return Object.fromEntries(
    Object.entries(query).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
  )
}

/** Fases cuja aba faz parte da pista. null mantém o título padrão. */
function artifactTitle(phase: Phase, query: PhaseQuery): string | null {
  switch (phase.artifact) {
    case "river":
      return MUD_TITLE
    case "blood":
      return riverTitle(levelFrom(query))
    case "ice":
      return frozenTitle(query.grade ?? null)
    case "eyes":
      return RIVER_BANKS_TITLE
    case "fire":
      return fireOpens(query.muro) ? "vigília · o muro se abriu" : null
    case "garden": {
      const state = waterState(query.agua ?? query["água"])
      return state === "forget" ? "vigília · esquecer" : state === "remember" ? "vigília · lembrar" : null
    }
    case "mercury":
      return EAGLE_TITLE
    case "sun":
      return CROWN_TITLE
    case "ladder":
      return LADDER_TITLE
    case "virtues": {
      const passed = examPasses(query.exame)
      return passed === null ? null : passed ? EXAM_PASS_TITLE : EXAM_FAIL_TITLE
    }
    case "angels":
      return choirTitle(query.coro)
    default:
      return null
  }
}

function parseIndex(n: string): number | null {
  if (!/^\d+$/.test(n)) return null
  return Number.parseInt(n, 10)
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { n } = await params
  const index = parseIndex(n)
  const phase = index === null ? undefined : getPhase(index)
  if (!phase) return { title: "Sem registro" }

  // Uma fase selada não entrega a aba da pista.
  const open = phase.index <= (await solvedUpTo()) + 1
  const clueTitle = open ? artifactTitle(phase, await readQuery(searchParams)) : null
  if (clueTitle) return { title: { absolute: clueTitle } }

  return {
    title: phase.tabTitle ? { absolute: phase.tabTitle } : String(phase.index) + ". " + phase.name,
    ...(phase.description ? { description: phase.description } : {}),
  }
}

function safeAttributes(attributes: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(attributes).filter(([name]) => /^(data|aria)-[\w-]+$/.test(name))
  )
}

export default async function PhasePage({ params, searchParams }: Props) {
  const { n } = await params
  const index = parseIndex(n)
  const phase = index === null ? undefined : getPhase(index)

  if (!phase) notFound()

  const reached = (await solvedUpTo()) + 1
  if (phase.index > reached) return <SealedPhase index={phase.index} reached={reached} />

  return (
    <main
      data-phase={phase.index}
      data-cantica={phase.cantica}
      className="dante-page mx-auto flex min-h-svh w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-8 sm:py-12"
    >
      <CanticaMark cantica={phase.cantica} />

      <header className="flex items-end justify-between gap-4 border-b border-border pb-6 sm:gap-6 sm:pb-8">
        <div className="flex items-end gap-5">
          <span className="dante-index" aria-hidden="true">{String(phase.index).padStart(2, "0")}</span>
          <h1 className="max-w-2xl text-balance font-serif text-2xl leading-tight sm:text-4xl">
            <span className="sr-only">Fase {phase.index}: </span>{phase.name}
          </h1>
        </div>
      </header>

      <PhaseArtifact media={phase.artifact} query={await readQuery(searchParams)} />

      <p
        className="max-w-3xl whitespace-pre-line text-pretty font-serif text-base leading-relaxed text-foreground/90 sm:text-lg"
        {...(phase.promptAttributes && safeAttributes(phase.promptAttributes))}
      >
        {phase.prompt}
      </p>

      <AnswerForm index={phase.index} shape={answerShape(phase.index)} />
      <HintPanel index={phase.index} />
      <PhaseFooter index={phase.index} cantica={phase.cantica} />
    </main>
  )
}

function SealedPhase({ index, reached }: { index: number; reached: number }) {
  return (
    <main className="dante-page mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-center gap-8 px-4 py-16 sm:px-8">
      <span className="dante-index" aria-hidden="true">{String(index).padStart(2, "0")}</span>
      <h1 className="font-serif text-3xl leading-tight sm:text-4xl">este registro ainda está selado.</h1>
      <p className="max-w-xl font-serif text-lg leading-relaxed text-foreground/80">
        o arquivo abre na ordem da viagem. o último registro aberto para você é o {String(reached).padStart(2, "0")}.
      </p>
      <div>
        <Button nativeButton={false} render={<Link href={"/f/" + reached} />} variant="outline" size="sm" className="font-mono text-xs tracking-[.08em]">
          voltar ao registro {String(reached).padStart(2, "0")}
        </Button>
      </div>
    </main>
  )
}
