import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AnswerForm } from "@/components/answer-form"
import { HintPanel } from "@/components/hint-panel"
import { CanticaMark, PhaseArtifact, PhaseFooter } from "@/components/phase-artifact"
import { getPhase } from "@/lib/phases"

type Props = {
  params: Promise<{ n: string }>
}

function parseIndex(n: string): number | null {
  if (!/^\d+$/.test(n)) return null
  return Number.parseInt(n, 10)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params
  const index = parseIndex(n)
  const phase = index === null ? undefined : getPhase(index)
  if (!phase) return { title: "Sem registro" }

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

export default async function PhasePage({ params }: Props) {
  const { n } = await params
  const index = parseIndex(n)
  const phase = index === null ? undefined : getPhase(index)

  if (!phase) notFound()

  return (
    <main
      data-phase={phase.index}
      data-cantica={phase.cantica}
      className="dante-page mx-auto flex min-h-svh w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-8 sm:py-12"
    >
      <CanticaMark cantica={phase.cantica} unit={phase.unit} />

      <header className="flex items-end justify-between gap-4 border-b border-border pb-6 sm:gap-6 sm:pb-8">
        <div className="flex items-end gap-5">
          <span className="dante-index" aria-hidden="true">{String(phase.index).padStart(2, "0")}</span>
          <h1 className="max-w-2xl text-balance font-serif text-2xl leading-tight sm:text-4xl">
            <span className="sr-only">Fase {phase.index}: </span>{phase.name}
          </h1>
        </div>
        <span className="hidden font-mono text-xs text-muted-foreground sm:block">arquivo dantesco</span>
      </header>

      <PhaseArtifact media={phase.artifact} />

      <p
        className="max-w-3xl whitespace-pre-line text-pretty font-serif text-base leading-relaxed text-foreground/90 sm:text-lg"
        {...(phase.promptAttributes && safeAttributes(phase.promptAttributes))}
      >
        {phase.prompt}
      </p>

      {phase.index !== 30 && <AnswerForm index={phase.index} />}
      <HintPanel index={phase.index} />
      <PhaseFooter index={phase.index} cantica={phase.cantica} unit={phase.unit} />
    </main>
  )
}
