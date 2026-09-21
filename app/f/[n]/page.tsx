import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AnswerForm } from "@/components/answer-form"
import { HintPanel } from "@/components/hint-panel"
import {
  CrescentMark,
  PhaseArtifact,
  PhaseFooter,
} from "@/components/phase-artifact"
import { getPhase } from "@/lib/phases"

type Props = {
  params: Promise<{ n: string }>
  searchParams: Promise<{ p?: string | string[] }>
}

function parseIndex(n: string): number | null {
  // Só dígitos: "/f/01" e "/f/1e2" não podem virar a mesma fase.
  if (!/^\d+$/.test(n)) return null
  return Number.parseInt(n, 10)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params
  const index = parseIndex(n)
  const phase = index === null ? undefined : getPhase(index)

  // Algumas fases usam o título literal da aba como parte da pista.
  if (!phase) return { title: "Sem registro" }

  return {
    title: phase.tabTitle
      ? { absolute: phase.tabTitle }
      : `${phase.index}. ${phase.name}`,
    ...(phase.description ? { description: phase.description } : {}),
  }
}

/**
 * O comentário é conteúdo nosso, não do jogador. Ainda assim `--` é removido:
 * um `-->` no meio do texto fecharia o comentário e despejaria o resto na
 * página.
 */
function commentMarkup(text: string) {
  return { __html: `<!-- ${text.replace(/--+/g, "-")} -->` }
}

/**
 * Só `data-` e `aria-` passam. A fase declara os atributos do enunciado, e
 * essa lista impede que um descuido no conteúdo vire um `onclick` ou um
 * `style` no HTML servido.
 */
function safeAttributes(attributes: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(attributes).filter(([name]) => /^(data|aria)-[\w-]+$/.test(name))
  )
}

export default async function PhasePage({ params, searchParams }: Props) {
  const [{ n }, query] = await Promise.all([params, searchParams])
  const index = parseIndex(n)
  const phase = index === null ? undefined : getPhase(index)

  if (!phase) notFound()

  const returnsToOpening = phase.index === 26
  const visibleIndex = returnsToOpening ? 1 : phase.index
  const visibleName = returnsToOpening ? "A janela" : phase.name

  const rawPage = query.p
  const hasPageQuery = rawPage !== undefined
  const pageNumber =
    typeof rawPage === "string" && /^\d+$/.test(rawPage)
      ? Number.parseInt(rawPage, 10)
      : null
  const inventoryLabels =
    phase.index === 10
      ? Array.from({ length: 9 }, (_, offset) => {
          const entry = getPhase(offset + 1)
          return entry ? { index: entry.index, name: entry.name } : null
        }).filter((entry): entry is { index: number; name: string } => entry !== null)
      : []
  const isWide = [10, 12, 15, 17, 18, 20, 21, 22, 23, 24, 25, 26, 28, 30].includes(phase.index)

  return (
    <main
      data-phase={phase.index}
      className={`mx-auto flex min-h-svh w-full ${isWide ? "max-w-5xl" : "max-w-xl"} flex-col justify-center gap-10 px-6 py-16`}
    >
      <header className="flex flex-col gap-6">
        <span
          className="font-mono text-6xl leading-none tracking-tight text-muted-foreground/40 tabular-nums sm:text-7xl"
          aria-hidden="true"
        >
          {String(visibleIndex).padStart(2, "0")}
        </span>

        <h1 className="text-balance text-xl font-medium">
          <span className="sr-only">Fase {visibleIndex}: </span>
          {visibleName}
        </h1>
      </header>

      {(phase.index === 1 || returnsToOpening) && <CrescentMark changed={returnsToOpening} />}

      <PhaseArtifact
        media={phase.media}
        page={index === 5 ? pageNumber : null}
        hasQuery={index === 5 && hasPageQuery}
        labels={inventoryLabels}
      />

      <p
        className="whitespace-pre-line text-pretty leading-relaxed"
        {...(phase.promptAttributes && safeAttributes(phase.promptAttributes))}
      >
        {phase.prompt}
      </p>

      {(phase.index === 1 || phase.index === 26) && (
        <div hidden aria-hidden="true" data-source-comment dangerouslySetInnerHTML={commentMarkup(phase.htmlComment ?? "")} />
      )}

      {phase.index !== 30 && <AnswerForm index={phase.index} />}

      <HintPanel index={phase.index} />

      <PhaseFooter index={phase.index} suffix={returnsToOpening ? " io" : ""} />
    </main>
  )
}
