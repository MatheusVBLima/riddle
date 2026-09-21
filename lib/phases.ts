import "server-only"

import { normalizeAnswer } from "@/lib/normalize"

/**
 * O conteúdo das fases vive só no servidor.
 *
 * Isso não é zelo genérico: neste jogo o HTML entregue ao navegador é parte do
 * enigma, e o jogador é explicitamente incentivado a ler o source. Se as
 * respostas e as dicas viajassem no bundle, todas as 30 fases seriam
 * resolvíveis com um Ctrl+U. As pistas plantadas são visíveis de propósito; o
 * gabarito, nunca.
 */

export type Difficulty = 1 | 2 | 3 | 4 | 5

export type Phase = {
  index: number
  /** Nome da fase. Aparece como título da aba, então pode carregar pista. */
  name: string
  difficulty: Difficulty
  /** Fragmento de narrativa ou enunciado. O que o jogador lê ao chegar. */
  prompt: string
  /** Resposta canônica, como seria escrita por extenso. */
  answer: string
  /** Outras formas aceitas. A normalização já cobre caixa, acento e hífen. */
  accepts?: string[]
  /** Exatamente três: direção, mecânica, quase-solução. */
  hints: [string, string, string]
  solution: string
  /**
   * Comentário plantado no HTML da fase. Chega ao navegador e não é desenhado,
   * que é exatamente o ponto de várias fases. Declarado aqui para o autor da
   * fase não precisar mexer no componente da página.
   */
  htmlComment?: string
}

/** O que pode chegar ao cliente sem estragar o enigma. */
export type PhaseMeta = Pick<Phase, "index" | "name" | "difficulty" | "prompt">

/**
 * Registro das fases. O conteúdo definitivo das 30 é especificado à parte e
 * entra aqui; as duas abaixo existem para a base ser jogável de ponta a ponta.
 */
const PHASES: Phase[] = [
  {
    index: 1,
    name: "A porta não está trancada",
    difficulty: 1,
    prompt:
      "Toda porta anuncia para onde leva. Esta também, e ela não está escondendo nada de você — só não está falando em voz alta.",
    answer: "destrancada",
    accepts: ["a porta esta destrancada", "unlocked"],
    hints: [
      "Você já reparou em tudo que o navegador está te mostrando agora?",
      "A barra de endereço não é só onde a página mora. Ela faz parte do que você está lendo.",
      "O endereço desta fase termina num nome. Leia esse nome como se fosse a última palavra da frase acima.",
    ],
    solution:
      "O slug da URL desta fase é a resposta. A frase fala de uma porta que não esconde nada: o endereço já dizia o estado dela.",
  },
  {
    index: 2,
    name: "Quem escreveu isto deixou de sair",
    difficulty: 2,
    prompt:
      "Existe uma linha aqui que ninguém deveria ler. Ela não está apagada. Está apenas do lado de fora do que a página resolveu mostrar.",
    answer: "margem",
    accepts: ["a margem", "margin"],
    hints: [
      "Nem tudo que o navegador recebe ele desenha na tela.",
      "O código-fonte desta página tem mais texto do que a tela tem.",
      "Procure por um comentário no HTML. Ele não está escondido, só não é renderizado.",
    ],
    solution:
      "Um comentário HTML no corpo da página carrega a palavra. Comentários chegam ao navegador e não são desenhados — a 'margem' do documento.",
    htmlComment:
      "quem escreve no que nao e lido escreve na margem",
  },
]

const byIndex = new Map(PHASES.map((phase) => [phase.index, phase]))

export const PHASE_COUNT = PHASES.length

export function getPhase(index: number): Phase | undefined {
  return byIndex.get(index)
}

export function getPhaseMeta(index: number): PhaseMeta | undefined {
  const phase = byIndex.get(index)
  if (!phase) return undefined

  const { index: i, name, difficulty, prompt } = phase
  return { index: i, name, difficulty, prompt }
}

export function isCorrect(index: number, submitted: string): boolean {
  const phase = byIndex.get(index)
  if (!phase) return false

  const attempt = normalizeAnswer(submitted)
  if (!attempt) return false

  return [phase.answer, ...(phase.accepts ?? [])].some(
    (accepted) => normalizeAnswer(accepted) === attempt
  )
}
