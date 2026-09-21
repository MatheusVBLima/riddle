"use server"

import { getPhase, isCorrect, PHASE_COUNT } from "@/lib/phases"

export type AnswerResult =
  | { status: "correct"; next: number | null }
  | { status: "wrong" }
  | { status: "empty" }

export async function submitAnswer(
  index: number,
  submitted: string
): Promise<AnswerResult> {
  if (!submitted.trim()) return { status: "empty" }
  if (!isCorrect(index, submitted)) return { status: "wrong" }

  const next = index < PHASE_COUNT ? index + 1 : null
  return { status: "correct", next }
}

/**
 * As dicas são buscadas uma a uma, e não entregues junto com a fase, para que
 * abrir a terceira seja uma escolha do jogador em vez de um efeito colateral
 * de carregar a página.
 */
export async function revealHint(
  index: number,
  level: 1 | 2 | 3
): Promise<string | null> {
  return getPhase(index)?.hints[level - 1] ?? null
}

export async function revealSolution(index: number): Promise<string | null> {
  return getPhase(index)?.solution ?? null
}
