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
  /**
   * Uma dica só por fase. Ela é o único empurrão antes da solução, então
   * aponta a direção e a mecânica de uma vez — não é o "nudge" vago que faria
   * sentido se ainda viessem outras duas atrás.
   */
  hint: string
  solution: string
  /**
   * Comentário plantado no HTML da fase. Chega ao navegador e não é desenhado,
   * que é exatamente o ponto de várias fases. Declarado aqui para o autor da
   * fase não precisar mexer no componente da página.
   *
   * Cuidado: o Next serve a página inteira numa linha só, então um comentário
   * é praticamente invisível no Ctrl+U. Serve para fases avançadas, em que o
   * jogador já sabe procurar; nas primeiras, prefira `promptAttributes`.
   */
  htmlComment?: string
  /**
   * Atributos plantados no parágrafo do enunciado. Aparecem formatados e
   * legíveis na aba Elements do DevTools, que é onde um jogador consegue
   * mesmo achar uma pista de marcação.
   */
  promptAttributes?: Record<string, string>
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
    hint: "A barra de endereço não é só onde a página mora. Leia o fim dela como se fosse a última palavra da frase acima.",
    solution:
      "O slug da URL desta fase é a resposta. A frase fala de uma porta que não esconde nada: o endereço já dizia o estado dela.",
  },
  {
    index: 2,
    name: "Quem escreveu isto deixou de sair",
    difficulty: 2,
    prompt:
      "Você está lendo o que esta frase diz. Mas ninguém escreveu só a frase: em volta dela há instruções que o navegador cumpriu sem mostrar. Uma delas não é instrução nenhuma — é um bilhete.",
    answer: "margem",
    accepts: ["a margem", "margin"],
    hint: "Clique com o botão direito nesta frase e escolha Inspecionar. O que fica guardado junto de um parágrafo nem sempre é ordem para o navegador.",
    solution:
      "O parágrafo do enunciado carrega um atributo data-nota com o bilhete: quem escreve no que não é lido escreve na margem. Ele aparece formatado na aba Elements do DevTools.",
    promptAttributes: {
      "data-nota": "quem escreve no que nao e lido escreve na margem",
    },
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
