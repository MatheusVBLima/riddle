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
 * A dica é buscada sob demanda, e não entregue junto com a fase, para que
 * abri-la seja uma escolha do jogador em vez de um efeito colateral de
 * carregar a página — e para que não viaje no HTML de quem não pediu.
 */
export async function revealHint(index: number): Promise<string | null> {
  return getPhase(index)?.hint ?? null
}

export async function revealSolution(index: number): Promise<string | null> {
  return getPhase(index)?.solution ?? null
}
