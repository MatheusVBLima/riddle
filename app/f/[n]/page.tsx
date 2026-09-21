import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AnswerForm } from "@/components/answer-form"
import { HintLadder } from "@/components/hint-ladder"
import { getPhase } from "@/lib/phases"

type Props = { params: Promise<{ n: string }> }

function parseIndex(n: string): number | null {
  // Só dígitos: "/f/01" e "/f/1e2" não podem virar a mesma fase.
  if (!/^\d+$/.test(n)) return null
  return Number.parseInt(n, 10)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params
  const index = parseIndex(n)
  const phase = index === null ? undefined : getPhase(index)

  // O título da aba é superfície de pista, então carrega o nome da fase.
  return { title: phase ? `${phase.index}. ${phase.name}` : "Sem registro" }
}

/**
 * O comentário é conteúdo nosso, não do jogador. Ainda assim `--` é removido:
 * um `-->` no meio do texto fecharia o comentário e despejaria o resto na
 * página.
 */
function commentMarkup(text: string) {
  return { __html: `<!-- ${text.replace(/--+/g, "-")} -->` }
}

export default async function PhasePage({ params }: Props) {
  const { n } = await params
  const index = parseIndex(n)
  const phase = index === null ? undefined : getPhase(index)

  if (!phase) notFound()

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col justify-center gap-10 px-6 py-16">
      <header className="flex flex-col gap-6">
        <span
          className="font-mono text-6xl leading-none tracking-tight text-muted-foreground/40 tabular-nums sm:text-7xl"
          aria-hidden="true"
        >
          {String(phase.index).padStart(2, "0")}
        </span>

        <h1 className="text-balance text-xl font-medium">
          <span className="sr-only">Fase {phase.index}: </span>
          {phase.name}
        </h1>
      </header>

      <p className="text-pretty leading-relaxed">{phase.prompt}</p>

      {phase.htmlComment && (
        <div dangerouslySetInnerHTML={commentMarkup(phase.htmlComment)} />
      )}

      <AnswerForm index={phase.index} />

      <HintLadder index={phase.index} />
    </main>
  )
}
